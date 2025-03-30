import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayersRPGService } from '../services/players.rpg.service';
import { PlayerStatsQueryDTO } from '../dto/playerstats-query-dto';
import {
  UserAllDetails,
  UserProfileCompleteData,
} from '../dto/userProfile.dto';
import { ResponseService } from '@/shared/response/response.service';

@Controller('rpg/players')
export class PlayersRPGController {
  constructor(
    private readonly playersService: PlayersRPGService,
    private readonly responseService: ResponseService,
  ) {}

  @Get(':uuid')
  async getPlayerStats(
    @Param('uuid') uuid: string,
    @Query() query: PlayerStatsQueryDTO,
  ) {
    const { type } = query;
    const accountDetail = await this.playersService.fetchAccountDetail(uuid);

    if (type) {
      const accountStats = await this.playersService.fetchLeaderboardByType(
        uuid,
        type,
      );
      const formattedUser = {
        ...accountDetail,
        stats: accountStats,
      };
      return this.responseService.success<UserAllDetails>(formattedUser);
    } else {
      const completeUserData =
        await this.playersService.fetchCompleteUserData(uuid);
      const formattedUser = {
        ...accountDetail,
        ...completeUserData,
      };
      return this.responseService.success<UserProfileCompleteData>(
        formattedUser,
      );
    }
  }
}
