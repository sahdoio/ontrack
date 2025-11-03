import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQSEventBusAdapter } from './infrastructure/event-bus/sqs-event-bus.adapter';
import { FileLoggerService } from './infrastructure/logging/file-logger.service';
import { SQSConsumerService } from './infrastructure/messaging/sqs-consumer.service';
import { IdempotencyService } from './application/services/idempotency.service';
import { ProcessedEventEntity } from './infrastructure/database/entities/processed-event.entity';
import { EVENT_BUS } from './application/ports/event-bus.port';
import { S3StorageAdapter } from './infrastructure/aws/s3/s3-storage.adapter';
import { S3_STORAGE_PORT } from '../file-processing/application/ports/s3-storage.port';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ProcessedEventEntity])],
  providers: [
    {
      provide: EVENT_BUS,
      useClass: SQSEventBusAdapter,
    },
    {
      provide: S3_STORAGE_PORT,
      useClass: S3StorageAdapter,
    },
    FileLoggerService,
    SQSConsumerService,
    IdempotencyService,
  ],
  exports: [EVENT_BUS, S3_STORAGE_PORT, FileLoggerService, SQSConsumerService, IdempotencyService],
})
export class SharedModule {}
