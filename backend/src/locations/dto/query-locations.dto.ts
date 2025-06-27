import { IsOptional, IsDate, IsNumber, Min, IsISO8601, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryLocationsDto {
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  @Min(0)
  offset?: string;
}
