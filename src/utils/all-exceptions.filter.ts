import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { winstonErrorFormat } from "./winston.format";
import { Logger } from "winston";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) { }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.getResponse() : "Internal Server Error";

     this.logger.error({
      message: `${request.method} ${request.url} ${(exception as Error).message || JSON.stringify(exception)}`,
      traceId: (exception as Error).stack,
      format: winstonErrorFormat,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message
    });
  }
}