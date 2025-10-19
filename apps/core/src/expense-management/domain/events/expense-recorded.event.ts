import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class ExpenseRecorded implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'ExpenseRecorded';

  constructor(
    public readonly expenseId: string,
    public readonly groupId: string,
    public readonly payerId: string,
    public readonly name: string,
    public readonly amount: number, // cents
    public readonly splits: Array<{ memberId: string; amount: number }>,
  ) {
    this.occurredOn = new Date();
  }
}
