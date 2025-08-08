import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env.validation';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<EnvConfig, true>) {}

  get cacheTTL(): number {
    return this.configService.get('CACHE_TTL', { infer: true });
  }

  get getEnvironment(): string {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get getSentryDSN(): string {
    return this.configService.get('SENTRY_DSN', { infer: true });
  }
}
