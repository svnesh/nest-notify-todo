import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.userId,
      username: user.name,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
      },
    };
  }
}
