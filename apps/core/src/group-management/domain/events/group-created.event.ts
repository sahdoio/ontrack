import { v7 as uuidv7 } from 'uuid';
import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class GroupCreated implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventName: string = 'GroupCreated';
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(
    public readonly groupId: string,
    public readonly groupName: string,
    public readonly members: Array<{ id: string; name: string }>,
  ) {
    this.eventId = uuidv7();
    this.occurredOn = new Date();
    this.aggregateId = groupId;
  }
}
