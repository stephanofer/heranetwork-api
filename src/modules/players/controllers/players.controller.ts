import { Controller, Get, Param } from '@nestjs/common';
import { PlayersService } from '../services/players.service';
import { ResponseService } from '@/shared/response/response.service';
import { UserProfile } from '../dto/userProfile.dto';

@Controller('players')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly responseService: ResponseService,
  ) {}

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    try {
      const data = await this.playersService.fetchDetailsAccount(uuid);
      return this.responseService.success<UserProfile>(data);
    } catch (error) {
      console.log(error);
    }
  }
}
