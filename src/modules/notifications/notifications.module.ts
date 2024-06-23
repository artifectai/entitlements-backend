import { Module } from '@nestjs/common';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { NotificationsService } from './services/notifications.service';

@Module({
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
