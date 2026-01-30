import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, JwtService, UserService],
  imports: [PrismaModule],
})
export class NotificationModule {}
