import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationPersistenceService } from './notification-persistence.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationPersistenceService, JwtService, UserService],
  imports: [PrismaModule],
})
export class NotificationModule {}
