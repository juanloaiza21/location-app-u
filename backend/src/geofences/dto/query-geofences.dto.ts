import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryGeofencesDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string;
}
