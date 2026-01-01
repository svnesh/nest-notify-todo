import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async createTodo(
    createTodoDto: CreateTodoDto,
    owner: any,
  ) {
    console.log('owner=>', owner);
    const todoExists = await this.prismaService.todo.findMany({
      where: { title: createTodoDto.title, deletedAt: null },
    });

    if (todoExists.length > 0) {
      throw new HttpException('A todo with this title already exists.', 400);
    }

    return this.prismaService.todo.create({
      data: {
        title: createTodoDto.title,
        description: createTodoDto.description || null,
        completed: createTodoDto.completed || false,
        ownerId: owner.userId,
      },
    });
  }
  
}
