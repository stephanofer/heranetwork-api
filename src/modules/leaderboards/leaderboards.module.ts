import { Module } from '@nestjs/common';
import { LeaderboardsService } from '@/modules/leaderboards/services/leaderboards.service';
import { LeaderboardsControllerSurvi21 } from '@/modules/leaderboards/controller/leaderboards.survi21.controller';
import { LeaderboardsControllerRPG } from '@/modules/leaderboards/controller/leaderboards.rpg.controller';
import { LeaderBoardsServiceRPG } from '@/modules/leaderboards/services/leaderboard.rpg.service';
import { LeaderBoardsServiceSurvi21 } from '@/modules/leaderboards/services/leaderboard.survi21.service';

@Module({
  controllers: [LeaderboardsControllerSurvi21, LeaderboardsControllerRPG],
  providers: [
    LeaderboardsService,
    LeaderBoardsServiceRPG,
    LeaderBoardsServiceSurvi21,
  ],
  exports: [
    LeaderboardsService,
    LeaderBoardsServiceRPG,
    LeaderBoardsServiceSurvi21,
  ],
})
export class LeaderboardsModule {}
