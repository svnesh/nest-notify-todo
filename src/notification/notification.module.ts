import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [PrismaModule],
})
export class NotificationModule {}
