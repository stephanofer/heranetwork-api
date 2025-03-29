export interface LeaderboardEntry {
  uuid: string;
  playerName: string;
  value: number;
  dailyDelta: number;
  dailyLastTotal: number;
  dailyTimestamp: number;
}
