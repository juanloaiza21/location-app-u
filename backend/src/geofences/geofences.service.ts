import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGeofenceDto } from './dto/create-geofence.dto';
import { UpdateGeofenceDto } from './dto/update-geofence.dto';
import { QueryGeofencesDto } from './dto/query-geofences.dto';
import { QueryGeofenceAlertsDto } from './dto/query-alerts.dto';

@Injectable()
export class GeofencesService {
  constructor(private readonly prisma: PrismaService) { }

  // Crear nueva geofence
  async create(userId: string, createGeofenceDto: CreateGeofenceDto) {
    return this.prisma.geofence.create({
      data: {
        userId,
        name: createGeofenceDto.name,
        centerLatitude: createGeofenceDto.centerLatitude,
        centerLongitude: createGeofenceDto.centerLongitude,
        radiusMeters: createGeofenceDto.radiusMeters,
        isActive: createGeofenceDto.isActive ?? true,
      },
    });
  }

  // Obtener todas las geofences de un usuario con filtros opcionales
  async findAll(userId: string, queryDto: QueryGeofencesDto) {
    const { isActive, search } = queryDto;

    const whereClause: any = { userId };

    if (isActive !== undefined) {
      whereClause.isActive = isActive;
    }

    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive', // Búsqueda insensible a mayúsculas/minúsculas
      };
    }

    return await this.prisma.geofence.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });
  }

  // Obtener una geofence por ID
  async findOne(id: string, userId: string) {
    const geofence = await this.prisma.geofence.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!geofence) {
      throw new NotFoundException(`Geofence con ID ${id} no encontrada`);
    }

    return geofence;
  }

  // Actualizar una geofence
  async update(id: string, userId: string, updateGeofenceDto: UpdateGeofenceDto) {
    // Verificar que la geofence existe y pertenece al usuario
    await this.findOne(id, userId);

    return this.prisma.geofence.update({
      where: { id },
      data: updateGeofenceDto,
    });
  }

  // Eliminar una geofence
  async remove(id: string, userId: string) {
    // Verificar que la geofence existe y pertenece al usuario
    await this.findOne(id, userId);

    return this.prisma.geofence.delete({
      where: { id },
    });
  }

  // Verificar si una ubicación está dentro de alguna geofence activa
  async checkGeofencesForLocation(userId: string, latitude: number, longitude: number, locationId: string) {
    // Obtener todas las geofences activas del usuario
    const activeGeofences = await this.prisma.geofence.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    const alerts: any[] = [];  // Definimos explícitamente el tipo como any[]

    // Para cada geofence, calcular si el punto está dentro
    for (const geofence of activeGeofences) {
      const centerLat = typeof geofence.centerLatitude === 'object' ?
        Number(geofence.centerLatitude.toString()) : Number(geofence.centerLatitude);
      const centerLng = typeof geofence.centerLongitude === 'object' ?
        Number(geofence.centerLongitude.toString()) : Number(geofence.centerLongitude);
      const radius = typeof geofence.radiusMeters === 'object' ?
        Number(geofence.radiusMeters.toString()) : Number(geofence.radiusMeters);

      const isInside = this.isPointInGeofence(
        latitude,
        longitude,
        centerLat,
        centerLng,
        radius
      );

      // Obtener el último evento para esta geofence
      const lastEvent = await this.prisma.geofenceAlert.findFirst({
        where: {
          geofenceId: geofence.id,
          userId,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      // Determinar si necesitamos crear un nuevo evento
      let eventType: 'ENTER' | 'EXIT' | null = null;  // Definimos tipos específicos
      if (isInside && (!lastEvent || lastEvent.eventType === 'EXIT')) {
        eventType = 'ENTER';
      } else if (!isInside && (!lastEvent || lastEvent.eventType === 'ENTER')) {
        eventType = 'EXIT';
      }

      // Si hay un nuevo evento, registrarlo
      if (eventType) {
        const alert = await this.prisma.geofenceAlert.create({
          data: {
            geofenceId: geofence.id,
            userId,
            locationId,
            eventType,
          },
          include: {
            geofence: true,
          },
        });
        alerts.push(alert);
      }
    }

    return alerts;
  }

  // Obtener alertas de geofences
  async getAlerts(userId: string, queryDto: QueryGeofenceAlertsDto) {
    const { geofenceId, eventType, startDate, endDate } = queryDto;

    const whereClause: any = { userId };

    if (geofenceId) {
      whereClause.geofenceId = geofenceId;
    }

    if (eventType) {
      whereClause.eventType = eventType;
    }

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) {
        whereClause.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.timestamp.lte = new Date(endDate);
      }
    }

    return this.prisma.geofenceAlert.findMany({
      where: whereClause,
      include: {
        geofence: true,
        location: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  // Función de utilidad para calcular si un punto está dentro de una geofence circular
  private isPointInGeofence(
    pointLat: number,
    pointLng: number,
    centerLat: number,
    centerLng: number,
    radiusMeters: number
  ): boolean {
    // Implementación de la fórmula de Haversine para calcular distancia entre puntos
    const R = 6371e3; // Radio de la tierra en metros
    const φ1 = this.toRadians(pointLat);
    const φ2 = this.toRadians(centerLat);
    const Δφ = this.toRadians(centerLat - pointLat);
    const Δλ = this.toRadians(centerLng - pointLng);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusMeters;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
