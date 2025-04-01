import { RpgService } from '@/databases/rpgdb/rpgdb.service';
import { formatUUID } from '@/shared/utils/uuid.util';
import { Injectable } from '@nestjs/common';
import {
  UserProfile,
  UserStats,
  UserCompleteData,
} from '../dto/userProfile.dto';
import { StatType } from '@/shared/interfaces/stats.interface';
import {
  InvalidStatTypeException,
  UserNotFoundException,
} from '../exceptions/user.exception';

@Injectable()
export class PlayersRPGService {
  constructor(private prisma: RpgService) {}

  async fetchAccountDetail(uuid: string): Promise<UserProfile> {
    const formattedUUID = formatUUID(uuid);

    const userProfile = await this.prisma.userProfile.findUnique({
      where: {
        uuid: formattedUUID,
      },
      select: {
        uuid: true,
        lastNickname: true,
        lastServer: true,
        lastSeen: true,
        firstSeen: true,
      },
    });

    const userRank = await this.prisma.playerRankNetwork.findUnique({
      where: {
        uuid,
      },
    });

    if (!userProfile || !userRank) {
      throw new UserNotFoundException(uuid);
    }

    const formattedUser = {
      ...userProfile,
      primaryGroup: userRank.primaryGroup,
    };

    return formattedUser;
  }

  async fetchLeaderboardByType(
    uuid: string,
    type: StatType,
  ): Promise<UserStats> {
    switch (type) {
      case StatType.KILL:
        const kills = await this.prisma.rankingKill.findUnique({
          where: {
            uuid,
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        if (!kills) {
          throw new UserNotFoundException(uuid);
        }

        return {
          value: kills.value.toNumber(),
          dailyDelta: kills.dailyDelta.toNumber(),
          dailyLastTotal: kills.dailyLastTotal.toNumber(),
          dailyTimestamp: kills.dailyTimestamp.toNumber(),
        };

      case StatType.DEATH:
        const deaths = await this.prisma.rankingDeath.findUnique({
          where: {
            uuid,
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        if (!deaths) {
          throw new UserNotFoundException(uuid);
        }

        return {
          value: deaths.value.toNumber(),
          dailyDelta: deaths.dailyDelta.toNumber(),
          dailyLastTotal: deaths.dailyLastTotal.toNumber(),
          dailyTimestamp: deaths.dailyTimestamp.toNumber(),
        };

      case StatType.KD:
        const kds = await this.prisma.rankingKD.findUnique({
          where: {
            uuid,
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        if (!kds) {
          throw new UserNotFoundException(uuid);
        }

        return {
          value: kds.value.toNumber(),
          dailyDelta: kds.dailyDelta.toNumber(),
          dailyLastTotal: kds.dailyLastTotal.toNumber(),
          dailyTimestamp: kds.dailyTimestamp.toNumber(),
        };

      case StatType.LEVEL:
        const levels = await this.prisma.rankingLevel.findUnique({
          where: {
            uuid,
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        if (!levels) {
          throw new UserNotFoundException(uuid);
        }

        return {
          value: levels.value.toNumber(),
          dailyDelta: levels.dailyDelta.toNumber(),
          dailyLastTotal: levels.dailyLastTotal.toNumber(),
          dailyTimestamp: levels.dailyTimestamp.toNumber(),
        };

      case StatType.MAX_STREAK:
        const maxStreaks = await this.prisma.rankingMaxStreak.findUnique({
          where: {
            uuid,
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        if (!maxStreaks) {
          throw new UserNotFoundException(uuid);
        }

        return {
          value: maxStreaks.value.toNumber(),
          dailyDelta: maxStreaks.dailyDelta.toNumber(),
          dailyLastTotal: maxStreaks.dailyLastTotal.toNumber(),
          dailyTimestamp: maxStreaks.dailyTimestamp.toNumber(),
        };

      case StatType.ELO:
        const elos = await this.prisma.rankingElo.findUnique({
          where: {
            uuid,
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        if (!elos) {
          throw new UserNotFoundException(uuid);
        }

        return {
          value: elos.value.toNumber(),
          dailyDelta: elos.dailyDelta.toNumber(),
          dailyLastTotal: elos.dailyLastTotal.toNumber(),
          dailyTimestamp: elos.dailyTimestamp.toNumber(),
        };

      case StatType.KOTH:
        const koths = await this.prisma.rankingKoth.findUnique({
          where: {
            uuid,
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        if (!koths) {
          throw new UserNotFoundException(uuid);
        }

        return {
          value: koths.value.toNumber(),
          dailyDelta: koths.dailyDelta.toNumber(),
          dailyLastTotal: koths.dailyLastTotal.toNumber(),
          dailyTimestamp: koths.dailyTimestamp.toNumber(),
        };

      default:
        throw new InvalidStatTypeException(type);
    }
  }

  async fetchCompleteUserData(uuid: string): Promise<UserCompleteData> {
    const statTypes = [
      StatType.KILL,
      StatType.DEATH,
      StatType.KD,
      StatType.LEVEL,
      StatType.MAX_STREAK,
      StatType.ELO,
      StatType.KOTH,
    ];

    const statsPromises = statTypes.map((type) =>
      this.fetchLeaderboardByType(uuid, type),
    );

    const [kill, death, kd, level, maxstreak, elo, koth] =
      await Promise.all(statsPromises);

    const stats: UserCompleteData = {
      stats: {
        kill,
        death,
        kd,
        level,
        maxstreak,
        elo,
        koth,
      },
    };

    return stats;
  }
}
