import { Entity } from './entity.base';
import { IAggregateRoot } from '../interfaces/aggregate-root.interface';
import { IDomainEvent } from '../interfaces/domain-event.interface';

export abstract class AggregateRoot<T> extends Entity<T> implements IAggregateRoot {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  public addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  public getDomainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
