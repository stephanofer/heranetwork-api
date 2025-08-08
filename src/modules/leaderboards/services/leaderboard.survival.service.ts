import { SurvivalPrismaService } from '@/databases/survival/survival-prisma.service';
import {
  LeaderboardEntry,
  RankingEntry,
} from '@/modules/leaderboards/dto/leaderboard-entry.interface';
import { LeaderboardOptions } from '@/modules/leaderboards/dto/leaderboard-options.interface';
import { InvalidLeaderboardTypeException } from '@/modules/leaderboards/exceptions/leaderboard.exceptions';
import { PlayersService } from '@/modules/players/services/players.service';
import { StatsTypeSurvival } from '@/shared/interfaces/stats-type.interface';
import { Prisma } from '@global/client';
import { Injectable } from '@nestjs/common';

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
      throw error;
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
