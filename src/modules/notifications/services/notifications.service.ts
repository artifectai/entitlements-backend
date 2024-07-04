import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { NotificationsGateway } from '../gateway/notifications.gateway';
import { Notification } from '../../../common/types'

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  sendNotification(notification: Notification) {
    try {
      this.notificationsGateway.sendNotification(notification);
    } catch (error) {
      this.logger.error('Failed to send notification', error.stack);
      throw new InternalServerErrorException('Failed to send notification');
    }
  }

}
