import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Patch,
  Query
} from '@nestjs/common';
import { GeofencesService } from './geofences.service';
import { CreateGeofenceDto } from './dto/create-geofence.dto';
import { UpdateGeofenceDto } from './dto/update-geofence.dto';
import { QueryGeofencesDto } from './dto/query-geofences.dto';
import { QueryGeofenceAlertsDto } from './dto/query-alerts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('geofences')
@UseGuards(JwtAuthGuard) // Todas las rutas requieren autenticación
export class GeofencesController {
  constructor(private readonly geofencesService: GeofencesService) { }

  @Post()
  create(@Request() req, @Body() createGeofenceDto: CreateGeofenceDto) {
    return this.geofencesService.create(req.user.userId, createGeofenceDto);
  }

  @Get()
  findAll(@Request() req, @Query() queryDto: QueryGeofencesDto) {
    return this.geofencesService.findAll(req.user.userId, queryDto);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.geofencesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGeofenceDto: UpdateGeofenceDto,
  ) {
    return this.geofencesService.update(id, req.user.userId, updateGeofenceDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.geofencesService.remove(id, req.user.userId);
  }

  @Get('alerts/list')
  getAlerts(@Request() req, @Query() queryDto: QueryGeofenceAlertsDto) {
    return this.geofencesService.getAlerts(req.user.userId, queryDto);
  }
}
