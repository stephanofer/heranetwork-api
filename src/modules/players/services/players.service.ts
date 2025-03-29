import { RpgService } from '@/databases/rpgdb/rpgdb.service';
import { Injectable } from '@nestjs/common';
import { PlayersRPGService } from './players.rpg.service';
import { PlayersSurvi21Service } from './players.survi21.service';
import { UserProfile } from '../dto/userProfile.dto';

@Injectable()
export class PlayersService {
  constructor(
    private prisma: RpgService,
    private playersRPGService: PlayersRPGService,
    private playersSurvi21Service: PlayersSurvi21Service,
  ) {}

  formatUUID(uuid: string): string {
    return uuid.replace(/-/g, '');
  }

  async fetchDetailsAccount(uuid: string): Promise<UserProfile> {
    const formattedUUID = this.formatUUID(uuid);

    try {
      const userProfile = await this.prisma.userProfile.findUnique({
        where: {
          uuid: formattedUUID,
        },
        select: {
          uuid: true,
          lastNickname: true,
          lastServer: true,
          lastSeen: true,
          firstSeen: true,
        },
      });

      const userRank = await this.prisma.playerRankNetwork.findUnique({
        where: {
          uuid,
        },
      });

      const formattedUser = {
        ...userProfile,
        primaryGroup: userRank.primaryGroup,
      };

      return formattedUser;
    } catch (error) {
      console.log(error);
    }
  }
}
