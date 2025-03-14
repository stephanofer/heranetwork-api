import { Injectable } from '@nestjs/common';
import { RpgService } from '@/databases/rpgdb/rpgdb.service';

@Injectable()
export class LeaderBoardsServiceRPG {
  constructor(private prisma: RpgService) {}

  async getLeaderboard(id: string) {
    return this.prisma.rankingLevel.findMany({
      where: {
        uuid: id,
      },
    });
  }
}
