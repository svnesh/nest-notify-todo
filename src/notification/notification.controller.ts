import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/guards/jwt.guard';

@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('read')
  async markAsReadBulk(@Body() notificationIds: any) {
    return this.notificationService.markNotificationAsRead(notificationIds);
  }
}
