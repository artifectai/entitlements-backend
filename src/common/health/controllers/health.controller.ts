import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check();
  }
}
