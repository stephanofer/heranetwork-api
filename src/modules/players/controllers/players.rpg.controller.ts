import { Controller, Get, Param } from '@nestjs/common';
import { PlayersRPGService } from '../services/players.rpg.service';

@Controller('rpg/players')
export class PlayersRPGController {
  constructor(private readonly playersService: PlayersRPGService) {}

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }
}
