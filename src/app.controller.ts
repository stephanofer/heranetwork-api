import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealthCheck() {
    return this.appService.getHealthStatus();
  }

  @Get('/debug-sentry')
  getError() {
    throw new Error('Estoy testeando Sentry');
  }
}
