import { Injectable } from '@nestjs/common';
import { RpgService } from '@/databases/rpgdb/rpgdb.service';
import { StatType } from '@/shared/interfaces/stats.interface';
import { LeaderboardQueryDto } from '../dto/leaderboard-query.dto';
import { LeaderboardEntry } from '../dto/leaderboard-entry.interface';

@Injectable()
export class LeaderBoardsServiceRPG {
  constructor(private prisma: RpgService) {}

  async getLeaderboardByType(
    query: LeaderboardQueryDto,
  ): Promise<LeaderboardEntry[]> {
    const { type, order = 'desc' } = query;
    try {
      return await this.fetchLeaderboardByType(type, { order });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchLeaderboardByType(
    type: StatType,
    options: { order: string },
  ): Promise<LeaderboardEntry[]> {
    const { order } = options;

    const orderDiretion = order === 'asc' ? 'asc' : 'desc';

    switch (type) {
      case StatType.KILL:
        const kills = await this.prisma.rankingKill.findMany({
          where: {
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          orderBy: {
            value: orderDiretion,
          },
        });

        return kills.map((entry) => ({
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
        }));

      case StatType.DEATH:
        const deaths = await this.prisma.rankingDeath.findMany({
          where: {
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          orderBy: {
            value: orderDiretion,
          },
        });
        return deaths.map((entry) => ({
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
        }));

      case StatType.KD:
        const kds = await this.prisma.rankingKD.findMany({
          where: {
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          orderBy: {
            value: orderDiretion,
          },
        });
        return kds.map((entry) => ({
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
        }));

      case StatType.LEVEL:
        const levels = await this.prisma.rankingLevel.findMany({
          where: {
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          orderBy: {
            value: orderDiretion,
          },
        });
        return levels.map((entry) => ({
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
        }));

      case StatType.MAX_STREAK:
        const maxStreaks = await this.prisma.rankingMaxStreak.findMany({
          where: {
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          orderBy: {
            value: orderDiretion,
          },
        });
        return maxStreaks.map((entry) => ({
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
        }));

      case StatType.ELO:
        const elos = await this.prisma.rankingElo.findMany({
          where: {
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          orderBy: {
            value: orderDiretion,
          },
        });
        return elos.map((entry) => ({
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
        }));

      case StatType.KOTH:
        const koths = await this.prisma.rankingKoth.findMany({
          where: {
            value: {
              not: null,
            },
            nameCache: {
              not: null,
            },
          },
          orderBy: {
            value: orderDiretion,
          },
        });
        return koths.map((entry) => ({
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
        }));

      default:
        throw new Error(`Invalid stat type: ${type}`);
    }
  }
}
