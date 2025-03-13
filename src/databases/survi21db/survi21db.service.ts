import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@survi21db/client';

@Injectable()
export class SurviService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
