import { RpgPrismaService } from '@/databases/rpg/rpg-prisma.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [RpgPrismaService],
  exports: [RpgPrismaService],
})
export class RpgPrismaModule {}
