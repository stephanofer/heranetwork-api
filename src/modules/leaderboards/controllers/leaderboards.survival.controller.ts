import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { GetLeaderboardSurvivalDto } from '@/modules/leaderboards/dto/get-leaderboard.dto';
import { ResponseService } from '@/shared/response/response.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@/config/env.validation';
import { LeaderboardEntry } from '@/modules/leaderboards/dto/leaderboard-entry.interface';
import { Response } from 'express';
import { LeaderBoardsServiceSurvival } from '@/modules/leaderboards/services/leaderboard.survival.service';
@Controller('survival/leaderboards')
export class LeaderboardsControllerSurvival {
  private readonly CACHETTL: number;
  constructor(
    private readonly leaderboardsService: LeaderBoardsServiceSurvival,
    private readonly configService: ConfigService<EnvConfig, true>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly responseService: ResponseService,
  ) {
    this.CACHETTL = this.configService.get('CACHE_TTL');
  }

  @Get()
  async getLeaderboard(
    @Query() query: GetLeaderboardSurvivalDto,
    @Res() res: Response,
  ) {
    const { type, limit = 150, offset = 0 } = query;

    const cacheKey = `LeaderBoardSurvival:${type}:limit=${limit}:offset=${offset}`;
    const cachedData =
      await this.cacheManager.get<LeaderboardEntry[]>(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache-Status', 'HIT');

      return res.json(
        this.responseService.success<LeaderboardEntry[]>(cachedData),
      );
    }

    const data = await this.leaderboardsService.getLeaderboardByType(type, {
      limit,
      offset,
    });

    await this.cacheManager.set<LeaderboardEntry[]>(
      cacheKey,
      data,
      this.CACHETTL,
    );
    res.setHeader('X-Cache-Status', 'MISS');

    return res.json(this.responseService.success<LeaderboardEntry[]>(data));
  }
}
