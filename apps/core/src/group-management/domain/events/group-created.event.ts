import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class GroupCreated implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'GroupCreated';

  constructor(
    public readonly groupId: string,
    public readonly groupName: string,
    public readonly members: Array<{ id: string; name: string }>,
  ) {
    this.occurredOn = new Date();
  }
}
