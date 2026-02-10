import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { MyAppEventListener } from 'src/shared/eventlistener/myapp-event-listener';
import { NotificationPersistenceService } from 'src/notification/notification-persistence.service';
import { UserService } from 'src/user/user.service';
import { NotificationPublisher } from 'src/notification/notification.publisher';

@Module({
  controllers: [TodoController],
  providers: [
    TodoService,
    JwtService,
    MyAppEventListener,
    NotificationPersistenceService,
    UserService,
    NotificationPublisher,
  ],
  imports: [PrismaModule],
})
export class TodoModule {}
