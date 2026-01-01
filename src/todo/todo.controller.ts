import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { CurrentUser } from 'src/decorator/current.user';
import { AuthGuard } from 'src/guards/jwt.guard';

@UseGuards(AuthGuard)
@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
  ) {}

  @Post()
  create(
    @CurrentUser() owner: any,
    @Body() createTodoDto: CreateTodoDto
  ) {
    return this.todoService.createTodo(createTodoDto, owner);
  }
}
