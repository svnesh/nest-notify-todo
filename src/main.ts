import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { loggerInstance } from './utils/winston.logger';
import { WinstonModule } from 'nest-winston';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { mapValidtionToErrorCode } from './utils/map-error-code';
import { ErrorCode } from './shared/constants/error-code';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: loggerInstance,
    }),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        const mappedMessages = errors.map((err) => {
          const field = err.property;
          const constraintKey = err.constraints
            ? Object.keys(err.constraints!)[0]
            : 'unknown';

          return {
            field,
            errorCode: mapValidtionToErrorCode(field, constraintKey),
            message: err.constraints
              ? err.constraints[constraintKey]
              : 'Invalid value',
          };
        });
        return new BadRequestException({
          errorCode: ErrorCode.VALIDATION_ERROR,
          errors: mappedMessages,
        });
      },
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter(loggerInstance));
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
