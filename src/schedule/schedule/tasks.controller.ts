//Testing 
import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('run-cron')
  async runCron() {
    await this.tasksService.handleCron();
    return 'Cron job executed';
  }
}