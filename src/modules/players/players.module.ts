import { Module } from '@nestjs/common';
import { PlayersService } from './services/players.service';
import { PlayersController } from './controllers/players.controller';
import { PlayersRPGController } from './controllers/players.rpg.controller';
import { PlayersSurvivalController } from './controllers/players.survival.controller';
import { PlayersRPGService } from './services/players.rpg.service';
import { PlayersSurvivalService } from './services/players.survival.service';
import { RpgPrismaModule } from '@/databases/rpg/rpg-prisma.module';
import { SurvivalPrismaModule } from '@/databases/survival/survival-prisma.module';

@Module({
  controllers: [
    PlayersController,
    PlayersRPGController,
    PlayersSurvivalController,
  ],
  providers: [PlayersService, PlayersRPGService, PlayersSurvivalService],
  exports: [PlayersService, PlayersRPGService, PlayersSurvivalService],
  imports: [RpgPrismaModule, SurvivalPrismaModule],
})
export class PlayersModule {}
