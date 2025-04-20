import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { PlayersModule } from './modules/players/players.module';
import { ResponseModule } from './shared/response/response.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@/config/config.validation';
import { PrismaModule } from './databases/prisma.module';

@Module({
  imports: [
    PrismaModule,
    LeaderboardsModule,
    PlayersModule,
    ResponseModule,
    CacheModule.register({
      ttl: 10000,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
      expandVariables: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
