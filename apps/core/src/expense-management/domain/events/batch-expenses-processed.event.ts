import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class BatchExpensesProcessed implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'BatchExpensesProcessed';

  constructor(
    public readonly groupId: string,
    public readonly expenseIds: string[],
    public readonly totalAmount: number, // cents
  ) {
    this.occurredOn = new Date();
  }
}
