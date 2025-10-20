import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FileLoggerService } from './shared/infrastructure/logging/file-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new FileLoggerService();
  app.useLogger(logger);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  logger.log(
    `Environment: ${process.env.NODE_ENV || 'development'}`,
    'Bootstrap',
  );
}

bootstrap().catch((error: Error) => {
  const logger = new FileLoggerService();
  logger.error('Failed to start application', error.stack, 'Bootstrap');
  process.exit(1);
});
