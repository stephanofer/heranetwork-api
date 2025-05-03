import { Module } from '@nestjs/common';
import { PlayersService } from '@/modules/players/services/players.service';
import { RpgPrismaModule } from '@/databases/rpg/rpg-prisma.module';
import { SurvivalPrismaModule } from '@/databases/survival/survival-prisma.module';

@Module({
  controllers: [],
  providers: [PlayersService],
  exports: [PlayersService],
  imports: [RpgPrismaModule, SurvivalPrismaModule],
})
export class PlayersModule {}
