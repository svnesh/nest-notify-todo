import { Body, Controller, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { CurrentUser } from 'src/decorator/current.user';
import { AuthGuard } from 'src/guards/jwt.guard';
import { UpdateTodoDto } from './dto/update-todo.dto';

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

  @Put(':id')
  update(
    @CurrentUser() owner: any,
    @Body() updateTodoDto: UpdateTodoDto,
    @Param('id') id: string,
  ) {
    return this.todoService.updateTodo(+id, updateTodoDto, owner);
  }

  @Post('all')
  getAll(
    @CurrentUser() owner: any,
    @Query() pages: any
  ) {
    return this.todoService.getAllTodos(owner, pages);
  }


}
