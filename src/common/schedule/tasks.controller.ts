import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Public } from '../auth/public.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Public()
  @Get('run-cron')
  async runCron() {
    try {
      await this.tasksService.checkExpiredTrialAccess();
      return 'Cron job executed';
    } catch (error) {
      throw new InternalServerErrorException('Failed to execute cron job');
    }
  }

  @Public()
  @Get('run-backfill')
  async runBackfill() {
    try {
      await this.tasksService.backfillMarketCap();
      return 'Backfill job executed';
    } catch (error) {
      throw new InternalServerErrorException('Failed to execute backfill job');
    }
  }
}
