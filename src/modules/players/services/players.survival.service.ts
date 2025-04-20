import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersSurvivalService {
  constructor() {}

  findAll() {
    return `This action returns all players`;
  }
}
