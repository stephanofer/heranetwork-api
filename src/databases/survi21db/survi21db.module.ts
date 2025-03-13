import { Global, Module } from '@nestjs/common';
import { SurviService } from '@/databases/survi21db/survi21db.service';

@Global()
@Module({
  exports: [SurviService],
  providers: [SurviService],
})
export class Survi21dbModule {}
