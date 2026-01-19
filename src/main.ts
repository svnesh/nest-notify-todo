import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { loggerInstance } from './utils/logger';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: loggerInstance,
    }),
  });
  app.useGlobalFilters(new AllExceptionsFilter(loggerInstance));
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
