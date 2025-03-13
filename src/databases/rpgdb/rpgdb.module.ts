import { Global, Module } from '@nestjs/common';
import { RpgService } from '@/databases/rpgdb/rpgdb.service';

@Global()
@Module({
  exports: [RpgService],
  providers: [RpgService],
})
export class RpgdbModule {}
