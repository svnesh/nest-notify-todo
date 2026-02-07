import { Injectable } from '@nestjs/common';
import { NotificationPersistenceService } from './notification-persistence.service';
import { NotificationPayload } from './notification.payload';

@Injectable()
export class NotificationPublisher {
  constructor(
    private readonly notificationPersistenceService: NotificationPersistenceService
  ) {}

  async publish(payload: NotificationPayload) {
    return this.notificationPersistenceService.store(payload);
  }
}
