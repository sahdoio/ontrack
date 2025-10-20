import { Injectable, Logger } from '@nestjs/common';
import type { IDomainEvent } from '../../domain/interfaces/domain-event.interface';
import type { IEventBus } from '../../application/ports/event-bus.port';

@Injectable()
export class InMemoryEventBusAdapter implements IEventBus {
  private readonly logger = new Logger(InMemoryEventBusAdapter.name);

  publish(event: IDomainEvent): Promise<void> {
    this.logger.log(`Event published: ${event.eventName}`);
    return Promise.resolve();
  }

  async publishAll(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
