import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessRequestsService } from './services/access-requests.service';
import { AccessRequestsController } from './controllers/access-requests.controller';
import { AccessRequest } from 'src/models/access-request.model';
import { NotificationsModule } from '../../modules/notifications/notifications.module';

@Module({
  imports: [
    SequelizeModule.forFeature([AccessRequest]),
    NotificationsModule
  ], 
  providers: [AccessRequestsService], 
  controllers: [AccessRequestsController], 
  exports: [AccessRequestsService]
})
export class AccessRequestsModule {}
