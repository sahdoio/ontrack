import { v7 as uuidv7 } from 'uuid';
import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class ExpenseRecorded implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventName: string = 'ExpenseRecorded';
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(
    public readonly expenseId: string,
    public readonly groupId: string,
    public readonly payerId: string,
    public readonly name: string,
    public readonly amount: number,
    public readonly splits: Array<{ memberId: string; amount: number }>,
  ) {
    this.eventId = uuidv7();
    this.occurredOn = new Date();
    this.aggregateId = expenseId;
  }
}
