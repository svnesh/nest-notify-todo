import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try{
      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.prismaService.user.findUnique({
        where: { userId: payload.sub, deletedAt: null },
        select: { userId: true, name: true, email: true }
      });
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      request.user = user;
      return true;
    } 
    catch (error) {
      throw new UnauthorizedException();
    }
  }
}