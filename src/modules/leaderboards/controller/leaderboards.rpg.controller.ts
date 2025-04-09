import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { LeaderBoardsServiceRPG } from '../services/leaderboard.rpg.service';
import { LeaderboardQueryDto } from '../dto/leaderboard-query.dto';
import { ResponseService } from '@/shared/response/response.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@/config/env.validation';
import { LeaderboardEntry } from '../dto/leaderboard-entry.interface';
import { Response } from 'express';
import { PlayersRPGService } from '@/modules/players/services/players.rpg.service';

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
    @Query() query: LeaderboardQueryDto,
    @Res() res: Response,
  ) {
    const { type } = query;
    const cacheTTL = this.configService.get('CACHE_TTL');

    const cacheKey = `LeaderBoardRPG${type}`;
    const cachedData =
      await this.cacheManager.get<LeaderboardEntry[]>(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache-Status', 'HIT');

      return res.json(
        this.responseService.success<LeaderboardEntry[]>(cachedData),
      );
    }

    const data = await this.leaderboardsService.getLeaderboardByType(type);
    await this.cacheManager.set<LeaderboardEntry[]>(cacheKey, data, cacheTTL);
    res.setHeader('X-Cache-Status', 'MISS');

    return res.json(this.responseService.success<LeaderboardEntry[]>(data));
  }
}
