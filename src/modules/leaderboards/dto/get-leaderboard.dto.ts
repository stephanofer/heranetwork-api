import {
  StatsType,
  StatsTypeSurvival,
} from '@/shared/interfaces/stats-type.interface';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class GetLeaderboardDto {
  @IsEnum(StatsType)
  type: StatsType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 150;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;
}

export class GetLeaderboardSurvivalDto {
  @IsEnum(StatsType)
  type: StatsTypeSurvival;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 150;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;
}
