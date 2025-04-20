import { StatsType } from '@/shared/interfaces/stats-type.interface';

export interface GameModeStrategy {
  getTopPlayers(statsType: StatsType): Promise<any[]>;
  getPlayerStats(uuid: string): Promise<any>;
  getPlayerStatsByType(uuid: string, statsType: StatsType): Promise<any>;
}
