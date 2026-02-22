import { Injectable } from '@nestjs/common';
import { NotificationPersistenceService } from './notification-persistence.service';
import { NotificationPayload } from './notification.payload';
import { NotificationGateway } from 'src/gateway/notification.gateway';

@Injectable()
export class NotificationPublisher {
  constructor(
    private readonly notificationPersistenceService: NotificationPersistenceService,
    private readonly notificationGateway: NotificationGateway
  ) {}

  async publish(payload: NotificationPayload) {
    return this.notificationPersistenceService.store(payload);
  }

  async sendSocketNotification(payload: any) {
    this.notificationGateway.sendNotification(payload);
  }
}
