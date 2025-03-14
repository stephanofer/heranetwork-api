import { SurviService } from '@/databases/survi21db/survi21db.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersSurvi21Service {
  constructor(private prisma: SurviService) {}

  findAll() {
    return `This action returns all players`;
  }

  findOne(id: string) {
    return this.prisma.ajlb_deluxecombat_ranking_kills.findUnique({
      where: {
        id: id,
      },
    });
  }
}
