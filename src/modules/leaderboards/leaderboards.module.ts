import { Module } from '@nestjs/common';
import { LeaderboardsControllerSurvival } from '@/modules/leaderboards/controllers/leaderboards.survival.controller';
import { LeaderboardsControllerRPG } from '@/modules/leaderboards/controllers/leaderboards.rpg.controller';
import { LeaderBoardsServiceRPG } from '@/modules/leaderboards/services/leaderboard.rpg.service';
import { PlayersModule } from '@/modules/players/players.module';
import { LeaderBoardsServiceSurvival } from '@/modules/leaderboards/services/leaderboard.survival.service';

@Module({
  controllers: [LeaderboardsControllerSurvival, LeaderboardsControllerRPG],
  providers: [LeaderBoardsServiceRPG, LeaderBoardsServiceSurvival],
  exports: [LeaderBoardsServiceRPG, LeaderBoardsServiceSurvival],
  imports: [PlayersModule],
})
export class LeaderboardsModule {}
