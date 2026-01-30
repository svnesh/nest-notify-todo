import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UserService } from 'src/user/user.service';
import { ErrorCode } from 'src/shared/constants/error-code';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService
  ) {}

  async createBulkNotification(createNotificationDto: CreateNotificationDto[]) {
    if (createNotificationDto.length === 0) {
      return;
    }
    return this.prismaService.notification.createMany({
      data: createNotificationDto.map((dto) => ({
        ...dto,
        metaInfo: dto.metaInfo || {},
      })),
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

    return this.prismaService.notification.findMany({
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
    });
  }
}
