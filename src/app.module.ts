import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { RpgdbModule } from '@/databases/rpgdb/rpgdb.module';
import { Survi21dbModule } from '@/databases/survi21db/survi21db.module';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { PlayersModule } from './modules/players/players.module';
import { ResponseModule } from './shared/response/response.module';

@Module({
  imports: [
    RpgdbModule,
    Survi21dbModule,
    LeaderboardsModule,
    PlayersModule,
    ResponseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
