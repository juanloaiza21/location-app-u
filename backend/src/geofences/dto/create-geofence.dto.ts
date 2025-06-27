import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGeofenceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  centerLatitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  centerLongitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  radiusMeters: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean = true;
}
