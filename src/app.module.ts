import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { RpgdbModule } from '@/databases/rpgdb/rpgdb.module';
import { Survi21dbModule } from '@/databases/survi21db/survi21db.module';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { PlayersModule } from './modules/players/players.module';
import { ResponseModule } from './shared/response/response.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@/config/config.validation';

@Module({
  imports: [
    RpgdbModule,
    Survi21dbModule,
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
