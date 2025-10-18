import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class MemberAddedToGroup implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'MemberAddedToGroup';

  constructor(
    public readonly groupId: string,
    public readonly memberId: string,
    public readonly memberName: string,
  ) {
    this.occurredOn = new Date();
  }
}
