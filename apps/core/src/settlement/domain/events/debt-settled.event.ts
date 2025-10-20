import { v7 as uuidv7 } from 'uuid';
import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class DebtSettled implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventName: string = 'DebtSettled';
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(
    public readonly settlementId: string,
    public readonly groupId: string,
    public readonly payerId: string,
    public readonly receiverId: string,
    public readonly amount: number,
  ) {
    this.eventId = uuidv7();
    this.occurredOn = new Date();
    this.aggregateId = settlementId;
  }
}
