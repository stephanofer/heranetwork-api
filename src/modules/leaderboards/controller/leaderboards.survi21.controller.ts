import { Controller, Get, Param } from '@nestjs/common';
import { LeaderBoardsServiceSurvi21 } from '../services/leaderboard.survi21.service';

@Controller('survi21/leaderboards')
export class LeaderboardsControllerSurvi21 {
  constructor(
    private readonly leaderboardsService: LeaderBoardsServiceSurvi21,
  ) {}

  findAll() {
    // return this.leaderboardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaderboardsService.getLeaderboard(id);
  }
}
