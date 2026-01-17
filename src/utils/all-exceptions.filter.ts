import { ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";


export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}