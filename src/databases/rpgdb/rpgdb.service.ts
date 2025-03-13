import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@rpgdb/client';

@Injectable()
export class RpgService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
