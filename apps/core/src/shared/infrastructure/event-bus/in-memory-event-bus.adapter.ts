import { Injectable, Logger } from '@nestjs/common';
import type { IDomainEvent } from '../../domain/interfaces/domain-event.interface';

export interface IEventBus {
  publish(event: IDomainEvent): Promise<void>;
  publishAll(events: IDomainEvent[]): Promise<void>;
}

@Injectable()
export class InMemoryEventBusAdapter implements IEventBus {
  private readonly logger = new Logger(InMemoryEventBusAdapter.name);

  async publish(event: IDomainEvent): Promise<void> {
    this.logger.log(`Event published: ${event.eventName}`);
    // In a real implementation, this would dispatch to event handlers
    // For now, we just log the event
  }

  async publishAll(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
