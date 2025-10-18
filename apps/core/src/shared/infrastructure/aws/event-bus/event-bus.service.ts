import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IDomainEvent } from '../../../domain/interfaces/domain-event.interface';
import { SNSPublisherAdapter } from '../sns/sns-publisher.adapter';

/**
 * Event Bus Service
 *
 * Publishes domain events to both:
 * 1. Local event emitter (for in-process handlers)
 * 2. AWS SNS (for cross-service communication)
 */
@Injectable()
export class EventBusService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly snsPublisher: SNSPublisherAdapter,
  ) {}

  async publish(event: IDomainEvent): Promise<void> {
    // Emit locally
    this.eventEmitter.emit(event.eventName, event);

    // Publish to SNS for external consumers
    await this.snsPublisher.publish(event);
  }

  async publishAll(events: IDomainEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.publish(event)));
  }
}
