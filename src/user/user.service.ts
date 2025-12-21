import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new HttpException('User with this email already exists', 409);
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })    
    return user;
  }

  async getAllUsers() {
    return this.prismaService.user.findMany({
      omit: { password: true, },
      where: { deletedAt: null }
    });
  }

  async getUserById(id: number) {
    return this.findUserById(id)
      .then((user) => {
        if (!user) {
          throw new HttpException('User not found', 404);
        }
        return user;
      })    
    }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto
  ) {
    const updatingUser = this.findUserById(id);
    if (!updatingUser) {
      throw new HttpException('User not found', 404);
    }
    return this.prismaService.user.update({
      omit: { password: true, },
      where: { userId: id },
      data: updateUserDto
    })
  }

  async deleteUser(id: number) {
    const deletingUser = this.findUserById(id);
    if (!deletingUser) {
      throw new HttpException('User not found', 404);
    }
    return this.prismaService.user.update({
      omit: { password: true, },
      where: { userId: id },
      data: { deletedAt: new Date() }
    })
  }

  async getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email, deletedAt: null }
    })
  }

  hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  findUserById(id: number) {
    return this.prismaService.user.findUnique({
      omit: { password: true, },
      where: { userId: id, deletedAt: null }
    });
  }

}
