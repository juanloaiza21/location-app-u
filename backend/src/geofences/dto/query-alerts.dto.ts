import { IsOptional, IsString, IsDate, IsISO8601 } from 'class-validator';

export class QueryGeofenceAlertsDto {
  @IsOptional()
  @IsString()
  geofenceId?: string;

  @IsOptional()
  @IsString()
  eventType?: 'ENTER' | 'EXIT';

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;
}
