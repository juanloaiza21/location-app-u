import { IsNotEmpty, IsNumber, IsOptional, IsObject, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  accuracy?: number;

  @IsOptional()
  @IsString()
  deviceInfo: string;
}
