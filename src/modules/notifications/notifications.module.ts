import { Module } from '@nestjs/common';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { NotificationsService } from './services/notifications.service';

export interface Notification {
  type: string;
  message: string;
  [key: string]: any;
}

@Module({
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
