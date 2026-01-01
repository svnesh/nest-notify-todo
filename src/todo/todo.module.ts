import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TodoController],
  providers: [TodoService, JwtService],
  imports: [PrismaModule],
})
export class TodoModule {}
