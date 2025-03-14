import { Module } from '@nestjs/common';
import { PlayersService } from './services/players.service';
import { PlayersController } from './controllers/players.controller';
import { PlayersRPGController } from './controllers/players.rpg.controller';
import { PlayersSurvi21Controller } from './controllers/players.survi21.controller';
import { PlayersRPGService } from './services/players.rpg.service';
import { PlayersSurvi21Service } from './services/players.survi21.service';

@Module({
  controllers: [
    PlayersController,
    PlayersRPGController,
    PlayersSurvi21Controller,
  ],
  providers: [PlayersService, PlayersRPGService, PlayersSurvi21Service],
  exports: [PlayersService, PlayersRPGService, PlayersRPGService],
  imports: [],
})
export class PlayersModule {}
