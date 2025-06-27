import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { QueryLocationsDto } from './dto/query-locations.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, createLocationDto: CreateLocationDto) {
    return this.prisma.location.create({
      data: {
        userId,
        latitude: createLocationDto.latitude,
        longitude: createLocationDto.longitude,
        accuracy: createLocationDto.accuracy,
        deviceInfo: JSON.stringify(createLocationDto.deviceInfo),
      },
    });
  }

  async findAll(userId: string, queryDto: QueryLocationsDto) {
    const { startDate, endDate, limit, offset } = queryDto;

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

    let limit1: number = 100
    let offset2: number = 0
    if (limit != undefined) { limit1 = +limit; }
    if (offset != undefined) { offset2 = +offset; }

    const totalCount = await this.prisma.location.count({ where: whereClause });
    const locations = await this.prisma.location.findMany({
      where: whereClause,
      take: limit1 || 100,
      skip: offset2 || 0,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: locations,
      meta: {
        total: totalCount,
        limit: limit || 100,
        offset: offset || 0,
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

    return latestLocation;
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

    return location;
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
      deviceInfo: 'telegram_bot'
    });
  }
}
