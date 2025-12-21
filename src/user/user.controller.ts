import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/jwt.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('')
  create(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.userService.createUser(createUserDto)
      .then((user) => {
        const { password, ...result } = user;
        return result;
      })
  }

  @Put(':id')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string
  ) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Get('')
  listAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getById(
    @Param('id') id: string
  ) {
    return this.userService.getUserById(+id);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string
  ) {
    return this.userService.deleteUser(+id);
  }
}
