import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { QueryLocationsDto } from './dto/query-locations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('locations')
@UseGuards(JwtAuthGuard) // Todas las rutas requieren autenticación
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) { }

  @Post()
  create(@Request() req, @Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(req.user.userId, createLocationDto);
  }

  @Get()
  findAll(@Request() req, @Query() queryDto: QueryLocationsDto) {
    return this.locationsService.findAll(req.user.userId, queryDto);
  }

  @Get('latest')
  findLatest(@Request() req) {
    return this.locationsService.findLatest(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.locationsService.findOne(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.locationsService.remove(id, req.user.userId);
  }
}
