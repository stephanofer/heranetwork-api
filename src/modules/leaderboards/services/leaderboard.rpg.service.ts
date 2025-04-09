import { Injectable } from '@nestjs/common';
import { RpgService } from '@/databases/rpgdb/rpgdb.service';
import { StatType } from '@/shared/interfaces/stats.interface';
import { LeaderboardEntry } from '../dto/leaderboard-entry.interface';
import {
  InvalidLeaderboardTypeException,
  LeaderboardDataException,
} from '../exceptions/leaderboard.exceptions';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { PlayersRPGService } from '@/modules/players/services/players.rpg.service';

@Injectable()
export class LeaderBoardsServiceRPG {
  constructor(
    private prisma: RpgService,
    private readonly playersService: PlayersRPGService,
  ) {}

  async getLeaderboardByType(type: StatType): Promise<LeaderboardEntry[]> {
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
          take: 150,
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        return Promise.all(
          kills.map(async (entry, index) => {
            const userProfile = await this.playersService.fetchAccountDetail(
              entry.uuid,
            );

            return {
              rank: index + 1,
              userProfile,
              value: entry.value.toNumber(),
              dailyDelta: entry.dailyDelta.toNumber(),
              dailyLastTotal: entry.dailyLastTotal.toNumber(),
              dailyTimestamp: entry.dailyTimestamp.toNumber(),
            };
          }),
        );

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
          take: 150,
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        return Promise.all(
          deaths.map(async (entry, index) => {
            const userProfile = await this.playersService.fetchAccountDetail(
              entry.uuid,
            );

            return {
              rank: index + 1,
              userProfile,
              value: entry.value.toNumber(),
              dailyDelta: entry.dailyDelta.toNumber(),
              dailyLastTotal: entry.dailyLastTotal.toNumber(),
              dailyTimestamp: entry.dailyTimestamp.toNumber(),
            };
          }),
        );

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
          take: 150,
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        return Promise.all(
          kds.map(async (entry, index) => {
            const userProfile = await this.playersService.fetchAccountDetail(
              entry.uuid,
            );

            return {
              rank: index + 1,
              userProfile,
              value: entry.value.toNumber(),
              dailyDelta: entry.dailyDelta.toNumber(),
              dailyLastTotal: entry.dailyLastTotal.toNumber(),
              dailyTimestamp: entry.dailyTimestamp.toNumber(),
            };
          }),
        );

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
          take: 150,
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });
        return Promise.all(
          levels.map(async (entry, index) => {
            const userProfile = await this.playersService.fetchAccountDetail(
              entry.uuid,
            );

            return {
              rank: index + 1,
              userProfile,
              value: entry.value.toNumber(),
              dailyDelta: entry.dailyDelta.toNumber(),
              dailyLastTotal: entry.dailyLastTotal.toNumber(),
              dailyTimestamp: entry.dailyTimestamp.toNumber(),
            };
          }),
        );

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
          take: 150,
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        return Promise.all(
          maxStreaks.map(async (entry, index) => {
            const userProfile = await this.playersService.fetchAccountDetail(
              entry.uuid,
            );

            return {
              rank: index + 1,
              userProfile,
              value: entry.value.toNumber(),
              dailyDelta: entry.dailyDelta.toNumber(),
              dailyLastTotal: entry.dailyLastTotal.toNumber(),
              dailyTimestamp: entry.dailyTimestamp.toNumber(),
            };
          }),
        );

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
          take: 150,
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        return Promise.all(
          elos.map(async (entry, index) => {
            const userProfile = await this.playersService.fetchAccountDetail(
              entry.uuid,
            );

            return {
              rank: index + 1,
              userProfile,
              value: entry.value.toNumber(),
              dailyDelta: entry.dailyDelta.toNumber(),
              dailyLastTotal: entry.dailyLastTotal.toNumber(),
              dailyTimestamp: entry.dailyTimestamp.toNumber(),
            };
          }),
        );

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
          take: 150,
          select: {
            uuid: true,
            nameCache: true,
            value: true,
            dailyDelta: true,
            dailyLastTotal: true,
            dailyTimestamp: true,
          },
        });

        return Promise.all(
          koths.map(async (entry, index) => {
            const userProfile = await this.playersService.fetchAccountDetail(
              entry.uuid,
            );

            return {
              rank: index + 1,
              userProfile,
              value: entry.value.toNumber(),
              dailyDelta: entry.dailyDelta.toNumber(),
              dailyLastTotal: entry.dailyLastTotal.toNumber(),
              dailyTimestamp: entry.dailyTimestamp.toNumber(),
            };
          }),
        );

      default:
        throw new InvalidLeaderboardTypeException(type);
    }
  }
}
