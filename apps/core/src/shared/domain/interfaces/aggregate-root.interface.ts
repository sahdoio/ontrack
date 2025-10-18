import { IDomainEvent } from './domain-event.interface';

export interface IAggregateRoot {
  getDomainEvents(): IDomainEvent[];
  clearDomainEvents(): void;
  addDomainEvent(event: IDomainEvent): void;
}
