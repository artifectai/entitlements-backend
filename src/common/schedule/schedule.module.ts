import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AccessRequestsModule } from '../../modules/access-requests/access-requests.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DatasetsModule } from '../../modules/datasets/datasets.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Frequency } from '../../models/frequency.model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatasetsModule,
    AccessRequestsModule,
    SequelizeModule.forFeature([Frequency]),
  ],
  providers: [TasksService],
  controllers: [TasksController]
})
export class ScheduleTasksModule {}
