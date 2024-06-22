//Testing 
import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('run-cron')
  async runCron() {
    await this.tasksService.checkExpiredTrialAccess();
    return 'Cron job executed';
  }

  @Get('run-backfill')
  async runBackfill() {
    await this.tasksService.backfillMarketCap();
    return 'Cron job executed';
  }
}