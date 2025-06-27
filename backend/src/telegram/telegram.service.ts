import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private userMapping: Map<number, string> = new Map(); // chatId -> userId

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) { }

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      console.warn('No Telegram bot token provided. Bot is disabled.');
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.setupCommands();
  }

  private async checkGeofences(userId: string, latitude: number, longitude: number) {
    // Obtener todos los geofences activos del usuario
    const geofences = await this.prisma.geofence.findMany({
      where: { userId, isActive: true }
    });

    for (const geofence of geofences) {
      // Calcular distancia entre la ubicación y el centro del geofence
      const distance = this.calculateDistance(
        latitude, longitude,
        Number(geofence.centerLatitude), Number(geofence.centerLongitude)
      );

      // Si la distancia es menor que el radio, el usuario está dentro del geofence
      const isInside = distance <= Number(geofence.radiusMeters);

      // Aquí podrías implementar lógica para detectar entrada/salida
      // comparando con el estado anterior y enviar notificaciones
      console.log(`Usuario ${userId} ${isInside ? 'dentro' : 'fuera'} de geofence ${geofence.name}`);
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Implementar cálculo de distancia usando la fórmula de Haversine
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  private setupCommands() {
    // Comando /start
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId,
        '👋 Bienvenido al servicio de rastreo.\n\n' +
        'Para registrar tu número usa:\n' +
        '/register [tu_numero_telefono]\n\n' +
        'Para ver todos los comandos disponibles usa:\n' +
        '/help'
      );
    });

    // Comando /help
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId,
        '📋 Comandos disponibles:\n\n' +
        '/register [numero] - Registrar teléfono\n' +
        '/location - Compartir ubicación actual\n' +
        '/last - Ver tu última ubicación\n' +
        '/history [n] - Ver últimas n ubicaciones\n' +
        '/geofence create [nombre] [radio] - Crear nuevo geofence\n' +
        '/geofence list - Listar todos tus geofences\n' +
        '/geofence delete [id] - Eliminar un geofence\n' +
        '/settings - Configurar preferencias\n' +
        '/help - Ver esta ayuda'
      );
    });

    // Comando /register
    this.bot.onText(/\/register (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const phoneNumber = match[1];

      try {
        const user = await this.prisma.user.findUnique({
          where: { phoneNumber },
        });

        if (user) {
          this.userMapping.set(chatId, user.id);
          this.bot.sendMessage(chatId, `✅ Registrado con éxito como ${user.name}.\n\nPuedes compartir tu ubicación usando /location`);
        } else {
          this.bot.sendMessage(chatId, `❌ No se encontró ningún usuario con el número ${phoneNumber}.\n\nPrimero debes registrarte en la aplicación.`);
        }
      } catch (error) {
        console.error('Error en registro Telegram:', error);
        this.bot.sendMessage(chatId, '❌ Error al procesar el registro');
      }
    });

    // Comando /location
    this.bot.onText(/\/location/, (msg) => {
      const chatId = msg.chat.id;

      if (!this.userMapping.has(chatId)) {
        return this.bot.sendMessage(chatId, '⚠️ Primero debes registrar tu número con /register');
      }

      this.bot.sendMessage(chatId, '📍 Comparte tu ubicación:', {
        reply_markup: {
          keyboard: [
            [{ text: 'Compartir ubicación actual 📍', request_location: true }]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    });

    // Recibir ubicación
    this.bot.on('location', async (msg) => {
      const chatId = msg.chat.id;
      const userId = this.userMapping.get(chatId);

      if (!userId) {
        return this.bot.sendMessage(chatId, '⚠️ Primero debes registrar tu número con /register');
      }

      const { latitude, longitude } = msg.location;

      try {
        await this.prisma.location.create({
          data: {
            userId,
            latitude,
            longitude,
            accuracy: 0,
            deviceInfo: 'Telegram Bot',
          },
        });

        // Verificar si cruza algún geofence
        await this.checkGeofences(userId, latitude, longitude);

        this.bot.sendMessage(chatId, '✅ ¡Ubicación recibida y guardada!');
      } catch (error) {
        console.error(error);
        this.bot.sendMessage(chatId, '❌ Error al guardar ubicación');
      }
    });

    // Comando /last
    this.bot.onText(/\/last/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = this.userMapping.get(chatId);

      if (!userId) {
        return this.bot.sendMessage(chatId, '⚠️ Primero debes registrar tu número con /register');
      }

      try {
        const lastLocation = await this.prisma.location.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });

        if (!lastLocation) {
          return this.bot.sendMessage(chatId, 'No se encontraron ubicaciones registradas');
        }

        // Enviar última ubicación como mensaje y luego como ubicación en el mapa
        const dateStr = new Date(lastLocation.createdAt).toLocaleString();
        await this.bot.sendMessage(chatId,
          `📍 Última ubicación (${dateStr}):\n` +
          `Latitud: ${lastLocation.latitude}\n` +
          `Longitud: ${lastLocation.longitude}`
        );

        // Enviar ubicación como punto en el mapa
        await this.bot.sendLocation(
          chatId,
          Number(lastLocation.latitude),
          Number(lastLocation.longitude)
        );

      } catch (error) {
        console.error(error);
        this.bot.sendMessage(chatId, '❌ Error al consultar ubicación');
      }
    });

    // Implementar resto de comandos aquí...
  }
}
