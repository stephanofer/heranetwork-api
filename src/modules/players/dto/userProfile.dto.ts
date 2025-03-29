export interface UserProfile {
  uuid: string;
  lastNickname: string;
  lastServer: string | null;
  lastSeen: Date;
  firstSeen: Date;
  primaryGroup: string;
}
