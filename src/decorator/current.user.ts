import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface userInterface {
  userId: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  }
)