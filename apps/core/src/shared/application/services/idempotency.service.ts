import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessedEventEntity } from '../../infrastructure/database/entities/processed-event.entity';

@Injectable()
export class IdempotencyService {
  constructor(
    @InjectRepository(ProcessedEventEntity)
    private readonly processedEventRepository: Repository<ProcessedEventEntity>,
  ) {}

  async isEventProcessed(
    eventId: string,
    handlerName: string,
  ): Promise<boolean> {
    const processed = await this.processedEventRepository.findOne({
      where: { eventId, handlerName },
    });
    return !!processed;
  }

  async markEventAsProcessed(
    eventId: string,
    eventName: string,
    aggregateId: string,
    handlerName: string,
  ): Promise<void> {
    const processedEvent = this.processedEventRepository.create({
      eventId,
      eventName,
      aggregateId,
      handlerName,
      processedAt: new Date(),
    });

    await this.processedEventRepository.save(processedEvent);
  }
}
