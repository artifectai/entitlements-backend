import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config/config.module';
import { DatabaseService } from './database/database.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Dataset } from './models/dataset.model';
import { AccessRequest } from './models/access-request.model';
import { getSequelizeConfig } from './config/sequelize.config';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { DatasetsModule } from './modules/datasets/datasets.module';
import { AccessRequestsModule } from './modules/access-requests/access-requests.module';
import { ScheduleTasksModule } from './schedule/schedule/schedule.module';

@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    SequelizeModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getSequelizeConfig(configService),
    }),
    SequelizeModule.forFeature([User, Dataset, AccessRequest]),
    UsersModule,
    DatasetsModule,
    AccessRequestsModule,
    ScheduleTasksModule
  ],
  providers: [DatabaseService]
})

export class AppModule {}
