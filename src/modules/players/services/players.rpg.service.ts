import { RpgPrismaService } from '@/databases/rpg/rpg-prisma.service';
import { Injectable } from '@nestjs/common';
import { UserStats, UserCompleteData } from '../dto/userProfile.dto';
import { StatsType } from '@/shared/interfaces/stats-type.interface';
import {
  InvalidStatTypeException,
  UserNotFoundException,
} from '../exceptions/user.exception';

@Injectable()
export class PlayersRPGService {
  constructor(private prisma: RpgPrismaService) {}

  async fetchLeaderboardByType(
    uuid: string,
    type: StatsType,
  ): Promise<UserStats> {
    switch (type) {
      case StatsType.KILLS:
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

      case StatsType.DEATHS:
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

      case StatsType.KD:
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

      case StatsType.LEVEL:
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

      case StatsType.MAX_STREAK:
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

      case StatsType.ELO:
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

      case StatsType.KOTH:
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
      StatsType.KILLS,
      StatsType.DEATHS,
      StatsType.KD,
      StatsType.LEVEL,
      StatsType.MAX_STREAK,
      StatsType.ELO,
      StatsType.KOTH,
    ];

    const statsPromises = statTypes.map((type) =>
      this.fetchLeaderboardByType(uuid, type),
    );

    const [kills, deaths, kd, level, maxstreak, elo, koth] =
      await Promise.all(statsPromises);

    const stats: UserCompleteData = {
      stats: {
        kills,
        deaths,
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
