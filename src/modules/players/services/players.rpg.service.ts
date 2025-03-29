import { RpgService } from '@/databases/rpgdb/rpgdb.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersRPGService {
  constructor(private prisma: RpgService) {}
}
