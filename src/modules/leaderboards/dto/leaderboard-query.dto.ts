import { StatType } from '@/shared/interfaces/stats.interface';
import { IsEnum } from 'class-validator';

export class LeaderboardQueryDto {
  @IsEnum(StatType)
  type: StatType;
}
