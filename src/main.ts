import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import winston, { createLogger } from 'winston';
import { WinstonModule } from 'nest-winston';
import { winstonCustomFormat, winstonErrorFormat } from './utils/winston.format';

async function bootstrap() {
  const loggerInstance = createLogger({
    level: 'info',
    format: winstonCustomFormat,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error', format: winstonErrorFormat }),
      new winston.transports.File({ filename: 'combined.log' }),
    ]
  });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: loggerInstance,
    })
  });
  app.enableCors();

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
