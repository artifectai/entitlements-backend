import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TerminusModule, 
    HttpModule
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
