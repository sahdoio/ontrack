import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQSEventBusAdapter } from './infrastructure/event-bus/sqs-event-bus.adapter';
import { FileLoggerService } from './infrastructure/logging/file-logger.service';
import { SQSConsumerService } from './infrastructure/messaging/sqs-consumer.service';
import { IdempotencyService } from './application/services/idempotency.service';
import { ProcessedEventEntity } from './infrastructure/database/entities/processed-event.entity';
import { EVENT_BUS } from './application/ports/event-bus.port';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ProcessedEventEntity])],
  providers: [
    {
      provide: EVENT_BUS,
      useClass: SQSEventBusAdapter,
    },
    FileLoggerService,
    SQSConsumerService,
    IdempotencyService,
  ],
  exports: [EVENT_BUS, FileLoggerService, SQSConsumerService, IdempotencyService],
})
export class SharedModule {}
