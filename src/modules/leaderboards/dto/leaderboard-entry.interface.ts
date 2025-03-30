export interface LeaderboardEntry {
  rank: number;
  uuid: string;
  playerName: string;
  value: number;
  dailyDelta: number;
  dailyLastTotal: number;
  dailyTimestamp: number;
}
