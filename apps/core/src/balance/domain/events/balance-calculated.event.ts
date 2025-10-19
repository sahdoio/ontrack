import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class BalanceCalculated implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'BalanceCalculated';

  constructor(
    public readonly groupId: string,
    public readonly memberBalances: Array<{
      memberId: string;
      balance: number;
    }>,
  ) {
    this.occurredOn = new Date();
  }
}
