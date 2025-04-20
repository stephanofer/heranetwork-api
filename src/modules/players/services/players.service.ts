import { Injectable } from '@nestjs/common';
import { UserProfile } from '@/modules/players/dto/userProfile.dto';
import { formatUUID } from '@/shared/utils/uuid.util';
import { PrismaService } from '@/databases/prisma.service';
import { UserNotFoundException } from '@/modules/players/exceptions/user.exception';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async fetchAccountDetail(uuid: string): Promise<UserProfile> {
    const formattedUUID = formatUUID(uuid);
    const originalUUID = uuid;

    const [userProfile, userRank, userSkin] = await Promise.all([
      this.prisma.userProfile.findUnique({
        where: { uuid: formattedUUID },
        select: {
          uuid: true,
          lastNickname: true,
          lastServer: true,
          lastSeen: true,
          firstSeen: true,
          premiumId: true,
        },
      }),
      this.prisma.playerRankNetwork.findUnique({
        where: { uuid: originalUUID },
        select: { primaryGroup: true },
      }),
      this.prisma.userSkinData.findUnique({
        where: { uuid: originalUUID },
        select: { skinIdentifier: true },
      }),
    ]);

    if (!userProfile) {
      throw new UserNotFoundException(uuid);
    }

    if (!userRank) {
      throw new Error(`Rank data not found for user with UUID: ${uuid}`);
    }

    return {
      ...userProfile,
      primaryGroup: userRank.primaryGroup,
      skinUUID: userSkin?.skinIdentifier || null,
    };
  }

  async fetchAccountDetailsBatch(
    uuids: string[],
  ): Promise<Record<string, UserProfile>> {
    if (!uuids.length) return {};

    const formattedUuids = uuids.map((uuid) => formatUUID(uuid));

    const originalUuids = uuids;

    const [userProfiles, userRanks, userSkins] = await Promise.all([
      this.prisma.userProfile.findMany({
        where: { uuid: { in: formattedUuids } },
        select: {
          uuid: true,
          lastNickname: true,
          lastServer: true,
          lastSeen: true,
          firstSeen: true,
          premiumId: true,
        },
      }),

      this.prisma.playerRankNetwork.findMany({
        where: { uuid: { in: originalUuids } },
        select: { uuid: true, primaryGroup: true },
      }),

      this.prisma.userSkinData.findMany({
        where: { uuid: { in: originalUuids } },
        select: { uuid: true, skinIdentifier: true },
      }),
    ]);

    const profileMap = Object.fromEntries(
      userProfiles.map((profile) => [profile.uuid, profile]),
    );

    const rankMap = Object.fromEntries(
      userRanks.map((rank) => [rank.uuid, rank]),
    );

    const skinMap = Object.fromEntries(
      userSkins.map((skin) => [skin.uuid, skin]),
    );

    const result: Record<string, UserProfile> = {};

    const uuidMapping: Record<string, string> = {};
    uuids.forEach((originalUuid) => {
      const formatted = formatUUID(originalUuid);
      uuidMapping[formatted] = originalUuid;
    });

    for (const formattedUuid of formattedUuids) {
      const profile = profileMap[formattedUuid];
      const originalUuid = uuidMapping[formattedUuid];
      const rank = rankMap[originalUuid];

      if (profile && rank) {
        result[originalUuid] = {
          ...profile,
          primaryGroup: rank.primaryGroup,
          skinUUID: skinMap[originalUuid]?.skinIdentifier || null,
        };
      }
    }
    return result;
  }
}
