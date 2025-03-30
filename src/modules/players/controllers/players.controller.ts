import { Controller } from '@nestjs/common';
import { PlayersService } from '../services/players.service';
import { ResponseService } from '@/shared/response/response.service';

@Controller('players')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly responseService: ResponseService,
  ) {}
}
