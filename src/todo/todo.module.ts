import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { MyAppEventListener } from 'src/shared/eventlistener/myapp-event-listener';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, JwtService, MyAppEventListener, NotificationService],
  imports: [PrismaModule],
})
export class TodoModule {}
