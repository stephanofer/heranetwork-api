import { SurviService } from '@/databases/survi21db/survi21db.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaderBoardsServiceSurvi21 {
  constructor(private prisma: SurviService) {}

  async getLeaderboard(id: string) {
    return this.prisma.ajlb_deluxecombat_ranking_kills.findUnique({
      where: {
        id: id,
      },
    });
  }
}
