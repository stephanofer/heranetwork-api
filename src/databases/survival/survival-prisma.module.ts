import { Global, Module } from '@nestjs/common';
import { SurvivalPrismaService } from '@/databases/survival/surviva-prisma.service';

@Global()
@Module({
  providers: [SurvivalPrismaService],
  exports: [SurvivalPrismaService],
})
export class SurvivalPrismaModule {}
