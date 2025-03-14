import { Controller, Get, Param } from '@nestjs/common';
import { PlayersSurvi21Service } from '../services/players.survi21.service';

@Controller('survi21/players')
export class PlayersSurvi21Controller {
  constructor(private readonly playersService: PlayersSurvi21Service) {}

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }
}
