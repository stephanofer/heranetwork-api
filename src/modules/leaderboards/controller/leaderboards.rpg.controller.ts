import { Controller, Get, Query } from '@nestjs/common';
import { LeaderBoardsServiceRPG } from '../services/leaderboard.rpg.service';
import { LeaderboardQueryDto } from '../dto/leaderboard-query.dto';
import { ResponseService } from '@/shared/response/response.service';

@Controller('rpg/leaderboards')
export class LeaderboardsControllerRPG {
  constructor(
    private readonly leaderboardsService: LeaderBoardsServiceRPG,
    private readonly responseService: ResponseService,
  ) {}

  @Get()
  async getLeaderboard(@Query() query: LeaderboardQueryDto) {
    try {
      const data = await this.leaderboardsService.getLeaderboardByType(query);

      return this.responseService.success(data);
    } catch (error) {
      throw new Error(`Failed to retrieve leaderboard: ${error.message}`);
    }
  }
}
