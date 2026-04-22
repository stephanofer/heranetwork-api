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
  private readonly CACHETTL: number;
  constructor(
    private readonly leaderboardsService: LeaderBoardsServiceRPG,
    private readonly configService: ConfigService<EnvConfig, true>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly responseService: ResponseService,
  ) {
    this.CACHETTL = configService.get('CACHE_TTL');
  }

  @Get()
  async getLeaderboard(
    @Query() query: GetLeaderboardDto,
    @Res() res: Response,
  ) {
    const { type, limit = 150, offset = 0 } = query;

    const cacheKey = `LeaderBoardRPG:${type}:limit=${limit}:offset=${offset}`;
    const cachedData =
      await this.cacheManager.get<LeaderboardEntry[]>(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache-Status', 'HIT');
      res.setHeader('X-Cache-Remaining', Math.floor(timeRemaining / 1000)); // en segundos
      res.setHeader('X-Cache-Expires-At', new Date(cacheExpiry).toISOString());

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
    res.setHeader('X-Cache-Remaining', Math.floor(this.CACHETTL / 1000)); // TTL completo
    res.setHeader('X-Cache-Expires-At', new Date(expiryTime).toISOString());

    return res.json(this.responseService.success<LeaderboardEntry[]>(data));
  }
}
