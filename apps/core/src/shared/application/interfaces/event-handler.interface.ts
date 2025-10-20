import type { IDomainEvent } from '../../domain/interfaces/domain-event.interface';

export interface IEventHandler<T extends IDomainEvent = IDomainEvent> {
  handle(event: T): Promise<void>;
  canHandle(eventName: string): boolean;
}
