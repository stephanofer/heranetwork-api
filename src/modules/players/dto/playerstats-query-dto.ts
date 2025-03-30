import { StatType } from '@/shared/interfaces/stats.interface';
import { IsEnum } from 'class-validator';

export class PlayerStatsQueryDTO {
  @IsEnum(StatType)
  type: StatType;
}
