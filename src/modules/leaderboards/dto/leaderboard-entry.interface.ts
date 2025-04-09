import { UserProfile } from '@/modules/players/dto/userProfile.dto';

export interface LeaderboardEntry {
  rank: number;
  userProfile: UserProfile;
  value: number;
  dailyDelta: number;
  dailyLastTotal: number;
  dailyTimestamp: number;
}
