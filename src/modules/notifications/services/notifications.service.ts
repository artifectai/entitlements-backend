import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from '../gateway/notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  sendNotification(notification: any) {
    this.notificationsGateway.sendNotification(notification);
  }
}