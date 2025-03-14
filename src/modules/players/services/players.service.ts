import { RpgService } from '@/databases/rpgdb/rpgdb.service';
import { Injectable } from '@nestjs/common';
import { PlayersRPGService } from './players.rpg.service';
import { PlayersSurvi21Service } from './players.survi21.service';

@Injectable()
export class PlayersService {
  constructor(
    private prisma: RpgService,
    private playersRPGService: PlayersRPGService,
    private playersSurvi21Service: PlayersSurvi21Service,
  ) {}

  findAll() {
    return `This action returns all players`;
  }

  async findOne(id: string) {
    const rpg = await this.playersRPGService.findOne(id);
    const survi21 = await this.playersSurvi21Service.findOne(id);

    const result = {
      rpg,
      survi21,
    };
    return result;
  }
}
