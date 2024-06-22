import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AccessRequestsModule } from 'src/modules/access-requests/access-requests.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AccessRequestsModule,
  ],
  providers: [TasksService],
  controllers: [TasksController]
})
export class ScheduleTasksModule {}
