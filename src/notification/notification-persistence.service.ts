import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ErrorCode } from 'src/shared/constants/error-code';
import { NotificationPayload } from './notification.payload';

@Injectable()
export class NotificationPersistenceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService
  ) {}

  async store(payload: NotificationPayload) {
    return this.prismaService.notification.createMany({
      data: payload.receipientIds.map(
        (receipientId) =>
          ({
            entityType: payload.entityType,
            event: payload.event,
            entityId: payload.entityId,
            toUserId: receipientId,
            actorId: payload.ownerId.userId,
            metaInfo: payload.metadata || {},
          }) as any
      ),
      skipDuplicates: true,
    });
  }

  async markNotificationAsRead(notificationId: { Ids: number[] }) {
    try {
      if (notificationId.Ids.length === 0) {
        return;
      }
      const notifications = await this.prismaService.notification.findMany({
        where: {
          notificationId: { in: notificationId.Ids },
          deletedAt: null,
        },
      });
      const unReadNotifications = notifications
        .filter((n) => !n.isRead)
        .map((n) => n.notificationId);
      return this.prismaService.notification.updateMany({
        where: {
          notificationId: { in: unReadNotifications },
        },
        data: {
          isRead: true,
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async getUserNotifications(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException(ErrorCode.USER_NOT_FOUND, 404);
    }

    return this.prismaService.notification
      .findMany({
        where: {
          toUserId: userId,
          deletedAt: null,
          isRead: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          toUser: {
            select: { name: true, email: true },
          },
        },
      })
      .then((notifications) => notifications.map((n) => this.httpResponse(n)));
  }

  httpResponse = (notifyData) => {
    return {
      id: notifyData.notificationId,
      type: notifyData.entityType,
      message: notifyData.metaInfo?.title || '',
      entityId: notifyData.entityId,
      isRead: notifyData.isRead,
      createdAt: notifyData.createdAt,
      user: {
        id: notifyData.toUserId,
        name: notifyData.toUser?.name || '',
        email: notifyData.toUser?.email || '',
      },
    };
  };
}
