import { IDomainEvent } from '../../domain/interfaces/domain-event.interface';

export interface IEventBus {
  publish(event: IDomainEvent): Promise<void>;
  publishAll(events: IDomainEvent[]): Promise<void>;
}

export const EVENT_BUS = Symbol('IEventBus');
