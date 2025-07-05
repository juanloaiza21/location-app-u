import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { QueryLocationsDto } from './dto/query-locations.dto';
import { GeofencesService } from '../geofences/geofences.service';

@Injectable()
export class LocationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geofencesService: GeofencesService,
  ) { }

  async create(userId: string, createLocationDto: CreateLocationDto) {
    // Convertir deviceInfo a string JSON si es un objeto
    const deviceInfoStr = typeof createLocationDto.deviceInfo === 'object' ?
      JSON.stringify(createLocationDto.deviceInfo) : createLocationDto.deviceInfo;

    // Crear la ubicación
    const location = await this.prisma.location.create({
      data: {
        userId,
        latitude: createLocationDto.latitude,
        longitude: createLocationDto.longitude,
        accuracy: createLocationDto.accuracy,
        deviceInfo: deviceInfoStr,
      },
    });

    try {
      // Verificar si la ubicación está dentro de alguna geofence y generar alertas si es necesario
      const geofenceAlerts = await this.geofencesService.checkGeofencesForLocation(
        userId,
        createLocationDto.latitude,
        createLocationDto.longitude,
        location.id
      );

      // Devolver la ubicación creada junto con cualquier alerta generada
      return {
        location: {
          ...location,
          deviceInfo: location.deviceInfo ? JSON.parse(location.deviceInfo as string) : null
        },
        geofenceAlerts
      };
    } catch (error) {
      console.error('Error al verificar geofences:', error);
      // Si hay un error al verificar geofences, al menos devolvemos la ubicación
      return {
        location: {
          ...location,
          deviceInfo: location.deviceInfo ? JSON.parse(location.deviceInfo as string) : null
        },
        geofenceAlerts: []
      };
    }
  }

  async findAll(userId: string, queryDto: QueryLocationsDto) {
    const { startDate, endDate, limit, offset } = queryDto;

    // Aseguramos que limit y offset sean números
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : (limit || 100);
    const offsetNum = typeof offset === 'string' ? parseInt(offset, 10) : (offset || 0);

    const whereClause: any = { userId };

    // Añadir filtros de fecha si están presentes
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate);
      }
    }

    const totalCount = await this.prisma.location.count({ where: whereClause });
    const locations = await this.prisma.location.findMany({
      where: whereClause,
      take: limitNum,  // Usamos la versión numérica
      skip: offsetNum,  // Usamos la versión numérica
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parseamos deviceInfo de vuelta a objeto si existe
    const parsedLocations = locations.map(location => ({
      ...location,
      deviceInfo: location.deviceInfo ? JSON.parse(location.deviceInfo as string) : null
    }));

    return {
      data: parsedLocations,
      meta: {
        total: totalCount,
        limit: limitNum,
        offset: offsetNum,
      }
    };
  }

  async findLatest(userId: string) {
    const latestLocation = await this.prisma.location.findFirst({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestLocation) {
      throw new NotFoundException('No se encontraron ubicaciones para este usuario');
    }

    // Parsear deviceInfo si existe
    return {
      ...latestLocation,
      deviceInfo: latestLocation.deviceInfo ? JSON.parse(latestLocation.deviceInfo as string) : null
    };
  }

  async findOne(id: string, userId: string) {
    const location = await this.prisma.location.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!location) {
      throw new NotFoundException(`Ubicación con ID ${id} no encontrada`);
    }

    // Parsear deviceInfo si existe
    return {
      ...location,
      deviceInfo: location.deviceInfo ? JSON.parse(location.deviceInfo as string) : null
    };
  }

  async remove(id: string, userId: string) {
    const location = await this.findOne(id, userId);

    return this.prisma.location.delete({
      where: { id: location.id },
    });
  }

  // Método para integración con Telegram (placeholder)
  async saveFromTelegram(userId: string, lat: number, lon: number) {
    return this.create(userId, {
      latitude: lat,
      longitude: lon,
      deviceInfo: JSON.stringify({ source: 'telegram_bot' })  // Convertir a string JSON
    });
  }
}
