export interface IDomainEvent {
  eventId: string;
  eventName: string;
  occurredOn: Date;
  aggregateId: string;
}
