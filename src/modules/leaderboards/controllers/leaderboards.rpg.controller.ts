import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { LeaderBoardsServiceRPG } from '@/modules/leaderboards/services/leaderboard.rpg.service';
import { GetLeaderboardDto } from '@/modules/leaderboards/dto/get-leaderboard.dto';
import { ResponseService } from '@/shared/response/response.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@/config/env.validation';
import { LeaderboardEntry } from '@/modules/leaderboards/dto/leaderboard-entry.interface';
import { Response } from 'express';

@Controller('rpg/leaderboards')
export class LeaderboardsControllerRPG {
  constructor(
    private readonly leaderboardsService: LeaderBoardsServiceRPG,
    private readonly configService: ConfigService<EnvConfig, true>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly responseService: ResponseService,
  ) {}

  @Get()
  async getLeaderboard(
    @Query() query: GetLeaderboardDto,
    @Res() res: Response,
  ) {
    const { type, limit = 150, offset = 0 } = query;
    const cacheTTL = this.configService.get('CACHE_TTL');

    const cacheKey = `LeaderBoardRPG:${type}:limit=${limit}:offset=${offset}`;
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

    await this.cacheManager.set<LeaderboardEntry[]>(cacheKey, data, cacheTTL);
    res.setHeader('X-Cache-Status', 'MISS');

    return res.json(this.responseService.success<LeaderboardEntry[]>(data));
  }
}
