import { Injectable } from '@nestjs/common';
import { RpgService } from '@/databases/rpgdb/rpgdb.service';
import { StatType } from '@/shared/interfaces/stats.interface';
import { LeaderboardQueryDto } from '../dto/leaderboard-query.dto';
import { LeaderboardEntry } from '../dto/leaderboard-entry.interface';
import {
  InvalidLeaderboardTypeException,
  LeaderboardDataException,
} from '../exceptions/leaderboard.exceptions';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class LeaderBoardsServiceRPG {
  constructor(private prisma: RpgService) {}

  async getLeaderboardByType(
    query: LeaderboardQueryDto,
  ): Promise<LeaderboardEntry[]> {
    const { type } = query;

    try {
      return await this.fetchLeaderboardByType(type);
    } catch (error) {
      if (error instanceof InvalidLeaderboardTypeException) {
        throw error;
      }

      if (error instanceof PrismaClientKnownRequestError) {
        throw new LeaderboardDataException(`Database error: ${error.code}`);
      }

      if (error instanceof PrismaClientValidationError) {
        throw new LeaderboardDataException('Database validation error');
      }

      throw new LeaderboardDataException(
        'Failed to retrieve leaderboard data',
        error,
      );
    }
  }

  async fetchLeaderboardByType(type: StatType): Promise<LeaderboardEntry[]> {
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
            value: 'desc',
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

        return kills.map((entry, index) => ({
          rank: index + 1,
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
          dailyLastTotal: entry.dailyLastTotal.toNumber(),
          dailyTimestamp: entry.dailyTimestamp.toNumber(),
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
            value: 'desc',
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

        return deaths.map((entry, index) => ({
          rank: index + 1,
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
          dailyLastTotal: entry.dailyLastTotal.toNumber(),
          dailyTimestamp: entry.dailyTimestamp.toNumber(),
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
            value: 'desc',
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

        return kds.map((entry, index) => ({
          rank: index + 1,
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
          dailyLastTotal: entry.dailyLastTotal.toNumber(),
          dailyTimestamp: entry.dailyTimestamp.toNumber(),
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
            value: 'desc',
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

        return levels.map((entry, index) => ({
          rank: index + 1,
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
          dailyLastTotal: entry.dailyLastTotal.toNumber(),
          dailyTimestamp: entry.dailyTimestamp.toNumber(),
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
            value: 'desc',
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

        return maxStreaks.map((entry, index) => ({
          rank: index + 1,
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
          dailyLastTotal: entry.dailyLastTotal.toNumber(),
          dailyTimestamp: entry.dailyTimestamp.toNumber(),
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
            value: 'desc',
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

        return elos.map((entry, index) => ({
          rank: index + 1,
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
          dailyLastTotal: entry.dailyLastTotal.toNumber(),
          dailyTimestamp: entry.dailyTimestamp.toNumber(),
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
            value: 'desc',
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

        return koths.map((entry, index) => ({
          rank: index + 1,
          uuid: entry.uuid,
          playerName: entry.nameCache,
          value: entry.value.toNumber(),
          dailyDelta: entry.dailyDelta.toNumber(),
          dailyLastTotal: entry.dailyLastTotal.toNumber(),
          dailyTimestamp: entry.dailyTimestamp.toNumber(),
        }));

      default:
        throw new InvalidLeaderboardTypeException(type);
    }
  }
}
