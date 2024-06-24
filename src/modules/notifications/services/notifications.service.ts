import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from '../gateway/notifications.gateway';
import { Notification } from '../notifications.module'

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  sendNotification(notification: Notification) {
    this.notificationsGateway.sendNotification(notification);
  }
}
