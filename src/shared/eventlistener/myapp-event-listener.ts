import { OnEvent } from "@nestjs/event-emitter";
import { NotificationService } from "src/notification/notification.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MyAppEventListener {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
  ) {}

  @OnEvent('todo.created', { async: true })
  async handleTodoCreatedEvent(eventData: any) {
    const { entityId, entityType, ownerId, metadata } = eventData;
    const users = await this.prismaService.user.findMany({
      where: { userId: { not: ownerId }, deletedAt: null }
    });

    let notifyList: any[] = [];
    users.map((user) => {
      const notify = {
        entityId: entityId,
        entityType: entityType,
        toUserId: user.userId,
        metaInfo: metadata,
        createdAt: new Date(),
      };
      notifyList.push(notify);
    });

    await this.notificationService.createBulkNotification(notifyList);
  }
}