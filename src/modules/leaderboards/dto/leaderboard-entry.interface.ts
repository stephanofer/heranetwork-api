import { UserProfile } from '@/modules/players/dto/userProfile.dto';
import { Decimal } from '@prisma/client/runtime/library';

export interface RankingData {
  value: Decimal;
  dailyDelta: Decimal;
  dailyLastTotal: Decimal;
  dailyTimestamp: Decimal;
}

export interface RankingEntry extends RankingData {
  uuid: string;
}
export interface LeaderboardEntry extends RankingData {
  rank: number;
  userProfile: UserProfile;
}
