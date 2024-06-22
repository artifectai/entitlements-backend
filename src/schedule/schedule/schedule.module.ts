import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AccessRequestsModule } from 'src/modules/access-requests/access-requests.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DatasetsModule } from 'src/modules/datasets/datasets.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatasetsModule,
    AccessRequestsModule,
  ],
  providers: [TasksService],
  controllers: [TasksController]
})
export class ScheduleTasksModule {}
