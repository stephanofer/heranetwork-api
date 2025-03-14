import { Controller, Get, Param } from '@nestjs/common';
import { LeaderBoardsServiceRPG } from '../services/leaderboard.rpg.service';

@Controller('rpg/leaderboards')
export class LeaderboardsControllerRPG {
  constructor(private readonly leaderboardsService: LeaderBoardsServiceRPG) {}

  findAll() {
    // return this.leaderboardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaderboardsService.getLeaderboard(id);
  }
}
