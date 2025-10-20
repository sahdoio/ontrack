import { v7 as uuidv7 } from 'uuid';
import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class MemberAddedToGroup implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventName: string = 'MemberAddedToGroup';
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(
    public readonly groupId: string,
    public readonly memberId: string,
    public readonly memberName: string,
  ) {
    this.eventId = uuidv7();
    this.occurredOn = new Date();
    this.aggregateId = groupId;
  }
}
