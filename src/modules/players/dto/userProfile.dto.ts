import { StatsType } from '@/shared/interfaces/stats-type.interface';

export interface UserProfile {
  uuid: string;
  premiumId: string | null;
  skinUUID: string | null;
  lastNickname: string;
  lastServer: string | null;
  lastSeen: Date;
  firstSeen: Date;
  primaryGroup: string;
}

export interface UserStats {
  value: number;
  dailyDelta: number;
  dailyLastTotal: number;
  dailyTimestamp: number;
}

export interface UserAllDetails extends UserProfile {
  stats: UserStats;
}

export interface UserCompleteData {
  stats: {
    [key in StatsType]: UserStats;
  };
}

export interface UserProfileCompleteData
  extends UserProfile,
    UserCompleteData {}
