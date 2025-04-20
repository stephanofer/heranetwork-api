import { StatsType } from '@/shared/interfaces/stats-type.interface';
import { IsEnum } from 'class-validator';

export class PlayerStatsQueryDTO {
  @IsEnum(StatsType)
  type: StatsType;
}
