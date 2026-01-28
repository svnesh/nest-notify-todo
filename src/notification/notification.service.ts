import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async createBulkNotification(createNotificationDto: any[]) {
    if (createNotificationDto.length === 0) {
      return;
    }
    return this.prismaService.notification.createMany({
      data: createNotificationDto,
      skipDuplicates: true,
    });
  }
}
