import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { RpgdbModule } from './databases/rpgdb/rpgdb.module';
import { Survi21dbModule } from './databases/survi21db/survi21db.module';

@Module({
  imports: [PlayerModule, RpgdbModule, Survi21dbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
