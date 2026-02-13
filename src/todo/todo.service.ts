import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { constructResponse, paginate } from 'src/utils/pagination';
import { ErrorCode } from 'src/shared/constants/error-code';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateEventInterface } from 'src/shared/interface/event.interface';
import { EntityTypeEnum, TodoEnum } from 'src/shared/constants/enums';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async createTodo(createTodoDto: CreateTodoDto, owner: any) {
    const todoExists = await this.prismaService.todo.findMany({
      where: { title: createTodoDto.title, deletedAt: null },
    });

    if (todoExists.length > 0) {
      throw new HttpException('A todo with this title already exists.', 400);
    }

    return this.prismaService.todo
      .create({
        data: {
          title: createTodoDto.title,
          description: createTodoDto.description || null,
          completed: createTodoDto.completed || false,
          ownerId: owner.userId,
        },
      })
      .then(async (todo) => {
        const eventData: CreateEventInterface = {
          event: TodoEnum.TODO_CREATED,
          entityId: todo.todoId,
          entityType: EntityTypeEnum.TODO,
          ownerId: todo.ownerId!,
          metadata: todo,
        };
        this.eventEmitter.emit(TodoEnum.TODO_CREATED, eventData);
      });
  }

  async updateTodo(todoId: number, updateTodoDto: UpdateTodoDto, owner: any) {
    const todo = await this.prismaService.todo.findFirst({
      where: { todoId: todoId, deletedAt: null, ownerId: owner.userId },
    });
    if (!todo) {
      throw new HttpException(ErrorCode.TODO_NOT_FOUND, 404);
    }
    const titleExists = await this.prismaService.todo.findMany({
      where: {
        title: updateTodoDto.title,
        deletedAt: null,
      },
    });
    if (titleExists.length > 0) {
      throw new HttpException(ErrorCode.TODO_TITLE_EXISTS, 400);
    }

    return this.prismaService.todo
      .update({
        where: { todoId: todoId },
        data: {
          title: updateTodoDto.title || todo.title,
          description: updateTodoDto.description || todo.description,
          completed:
            updateTodoDto.completed !== undefined
              ? updateTodoDto.completed
              : todo.completed,
        },
      })
      .then((updatedTodo) => {
        const eventData: CreateEventInterface = {
          event: TodoEnum.TODO_UPDATED,
          entityId: updatedTodo.todoId,
          entityType: EntityTypeEnum.TODO,
          ownerId: updatedTodo.ownerId!,
          metadata: { ...updatedTodo, previousData: todo },
        };
        this.eventEmitter.emit(TodoEnum.TODO_UPDATED, eventData);
      });
  }

  async getAllTodos(owner: any, pageDetails: any) {
    const { skip, limit: pageSize } = paginate(
      pageDetails.page,
      pageDetails.limit
    );
    const totalItems = await this.prismaService.todo.count({
      where: { deletedAt: null, ownerId: owner.userId },
    });

    const items = await this.prismaService.todo.findMany({
      where: { deletedAt: null, ownerId: owner.userId },
      skip,
      take: Number(pageSize),
    });
    return constructResponse(items, totalItems, pageSize, pageDetails.page);
  }

  async deleteTodo(todoId: number, owner: any) {
    const todo = await this.prismaService.todo.findFirst({
      where: { todoId: todoId, deletedAt: null, ownerId: owner.userId },
    });
    if (!todo) {
      throw new HttpException(ErrorCode.TODO_NOT_FOUND, 404);
    }
    return this.prismaService.todo.update({
      where: { todoId: todoId },
      data: { deletedAt: new Date() },
    });
  }
}
