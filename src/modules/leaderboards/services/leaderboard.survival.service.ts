import { Injectable } from '@nestjs/common';
import { PlayersService } from '@/modules/players/services/players.service';
import { SurvivalPrismaService } from '@/databases/survival/surviva-prisma.service';
import { LeaderboardEntry } from '@/modules/leaderboards/dto/leaderboard-entry.interface';
import { LeaderboardOptions } from '@/modules/leaderboards/dto/leaderboard-options.interface';
import { StatsTypeSurvival } from '@/shared/interfaces/stats-type.interface';
import {
  InvalidLeaderboardTypeException,
  LeaderboardDataException,
} from '@/modules/leaderboards/exceptions/leaderboard.exceptions';
import { RankingEntry } from '@/modules/leaderboards/dto/leaderboard-entry.interface';
import { Prisma } from '@global/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class LeaderBoardsServiceSurvival {
  constructor(
    private readonly prisma: SurvivalPrismaService,
    private readonly playersService: PlayersService,
  ) {}

  async getLeaderboardByType(
    type: StatsTypeSurvival,
    options: LeaderboardOptions = { limit: 150, offset: 0 },
  ): Promise<LeaderboardEntry[]> {
    try {
      return await this.fetchLeaderboardByType(type, options);
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

  async fetchLeaderboardByType(
    type: StatsTypeSurvival,
    options: LeaderboardOptions,
  ): Promise<LeaderboardEntry[]> {
    const { limit = 150, offset = 0 } = options;

    const baseQueryOptions = {
      where: {
        value: {
          not: null,
        },
      },
      orderBy: {
        value: Prisma.SortOrder.desc,
      },
      take: limit,
      skip: offset,
      select: {
        uuid: true,
        value: true,
        dailyDelta: true,
        dailyLastTotal: true,
        dailyTimestamp: true,
      },
    };

    let entries: RankingEntry[] = [];
    switch (type) {
      case StatsTypeSurvival.KILLS:
        entries = await this.prisma.rankingKill.findMany(baseQueryOptions);
        break;
      case StatsTypeSurvival.DEATHS:
        entries = await this.prisma.rankingDeath.findMany(baseQueryOptions);
        break;
      case StatsTypeSurvival.KD:
        entries = await this.prisma.rankingKD.findMany(baseQueryOptions);
        break;
      case StatsTypeSurvival.MAX_STREAK:
        entries = await this.prisma.rankingMaxStreak.findMany(baseQueryOptions);
        break;
      case StatsTypeSurvival.ELO:
        entries = await this.prisma.rankingElo.findMany(baseQueryOptions);
        break;
      case StatsTypeSurvival.KOTH:
        entries = await this.prisma.rankingKoth.findMany(baseQueryOptions);
        break;
      default:
        throw new InvalidLeaderboardTypeException(type);
    }

    const uuids = entries.map((entry) => entry.uuid);

    const userProfilesMap =
      await this.playersService.fetchAccountDetailsBatch(uuids);

    return entries.map((entry, index) => {
      return {
        rank: offset + index + 1,
        userProfile: userProfilesMap[entry.uuid],
        value: entry.value,
        dailyDelta: entry.dailyDelta,
        dailyLastTotal: entry.dailyLastTotal,
        dailyTimestamp: entry.dailyTimestamp,
      };
    });
  }
}
