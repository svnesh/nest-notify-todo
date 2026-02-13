import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NotificationPublisher } from 'src/notification/notification.publisher';

@Injectable()
export class MyAppEventListener {
  constructor(
    private readonly notificationPublisher: NotificationPublisher,
    private readonly prismaService: PrismaService
  ) {}

  @OnEvent('todo.*', { async: true })
  async handleTodoCreatedEvent(eventData: any) {
    const { event, entityId, entityType, ownerId, metadata } = eventData;
    const users = await this.prismaService.user.findMany({
      where: { userId: { not: ownerId }, deletedAt: null },
    });
    const receipientIds = users.map((user) => user.userId);
    const notifyList = {
      event,
      entityId,
      entityType,
      ownerId,
      metadata,
      receipientIds,
    };
    await this.notificationPublisher.publish(notifyList);
  }
}
