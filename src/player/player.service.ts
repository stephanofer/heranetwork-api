import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { RpgService } from '@/databases/rpgdb/rpgdb.service';

@Injectable()
export class PlayerService {
  constructor(private readonly rpgService: RpgService) {}

  create(createPlayerDto: CreatePlayerDto) {
    return 'This action adds a new player';
  }

  async findAll() {
    return await this.rpgService.userProfile.findMany();
  }

  async findOne(id: string) {
    const uuid = this.formatUuid(id);
    console.log(uuid);
    const user = await this.rpgService
      .$queryRaw`SELECT uniqueId FROM user_profiles WHERE uniqueId = ${id}`;
    const ranking = await this.rpgService
      .$queryRaw`SELECT id FROM ajlb_BLP_LEVEL WHERE id = ${uuid}`;
    console.log({ user, ranking });

    return this.rpgService.rankingLevel.findUnique({
      where: {
        uuid: uuid,
      },
      // include: {
      //   rankingLevel: true,
      // },
    });
  }

  formatUuid(uuid: string): string {
    if (!uuid || uuid.includes('-')) return uuid;

    // Formato estándar UUID: 8-4-4-4-12
    return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }
}
