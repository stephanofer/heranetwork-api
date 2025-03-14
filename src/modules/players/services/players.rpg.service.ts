import { RpgService } from '@/databases/rpgdb/rpgdb.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersRPGService {
  constructor(private prisma: RpgService) {}

  findAll() {
    return `This action returns all players`;
  }

  findOne(id: string) {
    return this.prisma.rankingKill.findUnique({
      where: {
        uuid: id,
      },
    });
  }
}
