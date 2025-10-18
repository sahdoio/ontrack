import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export interface IEventBus {
  publishAll(events: IDomainEvent[]): Promise<void>;
  publish(event: IDomainEvent): Promise<void>;
}

export const EVENT_BUS = Symbol('IEventBus');
