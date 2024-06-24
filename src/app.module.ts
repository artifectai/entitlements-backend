import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config/config.module';
import { DatabaseService } from './database/services/database.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Dataset } from './models/dataset.model';
import { Frequency } from './models/frequency.model';
import { AccessRequest } from './models/access-request.model';
import { getSequelizeConfig } from './config/sequelize/sequelize.config';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { DatasetsModule } from './modules/datasets/datasets.module';
import { AccessRequestsModule } from './modules/access-requests/access-requests.module';
import { ScheduleTasksModule } from './common/schedule/schedule.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { NotificationsService } from './modules/notifications/services/notifications.service';
import { NotificationsGateway } from './modules/notifications/gateway/notifications.gateway';

@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    SequelizeModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getSequelizeConfig(configService),
    }),
    SequelizeModule.forFeature([User, Dataset, AccessRequest, Frequency]),
    UsersModule,
    DatasetsModule,
    AccessRequestsModule,
    ScheduleTasksModule,
    NotificationsModule
  ],
  providers: [DatabaseService, NotificationsService, NotificationsGateway],

})

export class AppModule {}





















