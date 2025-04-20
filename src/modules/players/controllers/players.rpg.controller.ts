import { Controller, Get, Inject, Param, Query, Res } from '@nestjs/common';
import { PlayersRPGService } from '../services/players.rpg.service';
import { PlayerStatsQueryDTO } from '../dto/playerstats-query-dto';
import {
  UserAllDetails,
  UserProfileCompleteData,
} from '../dto/userProfile.dto';
import { ResponseService } from '@/shared/response/response.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@/config/env.validation';
import { Response } from 'express';
import { PlayersService } from '../services/players.service';

@Controller('rpg/players')
export class PlayersRPGController {
  constructor(
    private readonly playersService: PlayersRPGService,
    private readonly playersServices: PlayersService,
    private readonly responseService: ResponseService,
    private readonly configService: ConfigService<EnvConfig, true>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get(':uuid')
  async getPlayerStats(
    @Param('uuid') uuid: string,
    @Query() query: PlayerStatsQueryDTO,
    @Res() res: Response,
  ) {
    const { type } = query;
    const cacheTTL = this.configService.get('CACHE_TTL');

    if (type) {
      const cacheKey = `UserAllDetails${uuid}`;
      const cachedData = await this.cacheManager.get<UserAllDetails>(cacheKey);

      if (cachedData) {
        res.setHeader('X-Cache-Status', 'HIT');

        return res.json(
          this.responseService.success<UserAllDetails>(cachedData),
        );
      }

      const accountDetail = await this.playersServices.fetchAccountDetail(uuid);
      const accountStats = await this.playersService.fetchLeaderboardByType(
        uuid,
        type,
      );

      const formattedUser = {
        ...accountDetail,
        stats: accountStats,
      };

      await this.cacheManager.set(cacheKey, formattedUser, cacheTTL);

      res.setHeader('X-Cache-Status', 'MISS');
      return res.json(
        this.responseService.success<UserAllDetails>(formattedUser),
      );
    } else {
      const cacheKey = `UserProfileCompleteData${uuid}`;
      const cachedData =
        await this.cacheManager.get<UserProfileCompleteData>(cacheKey);

      if (cachedData) {
        res.setHeader('X-Cache-Status', 'HIT');
        return res.json(
          this.responseService.success<UserProfileCompleteData>(cachedData),
        );
      }

      const accountDetail = await this.playersServices.fetchAccountDetail(uuid);
      const completeUserData =
        await this.playersService.fetchCompleteUserData(uuid);

      const formattedUser = {
        ...accountDetail,
        ...completeUserData,
      };

      await this.cacheManager.set(cacheKey, formattedUser, cacheTTL);

      res.setHeader('X-Cache-Status', 'MISS');

      return res.json(
        this.responseService.success<UserProfileCompleteData>(formattedUser),
      );
    }
  }
}
