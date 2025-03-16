import { StatType } from '@/shared/interfaces/stats.interface';
import { PaginationDto } from '@/shared/response/dto/pagination.dto';
import { IsEnum } from 'class-validator';

export class LeaderboardQueryDto {
  @IsEnum(StatType)
  type: StatType;
  order: 'asc' | 'desc';
}
