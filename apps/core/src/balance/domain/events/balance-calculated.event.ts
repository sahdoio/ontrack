import { v7 as uuidv7 } from 'uuid';
import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class BalanceCalculated implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventName: string = 'BalanceCalculated';
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(
    public readonly groupId: string,
    public readonly memberBalances: Array<{
      memberId: string;
      balance: number;
    }>,
  ) {
    this.eventId = uuidv7();
    this.occurredOn = new Date();
    this.aggregateId = groupId;
  }
}
