import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class DebtSettled implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'DebtSettled';

  constructor(
    public readonly settlementId: string,
    public readonly groupId: string,
    public readonly payerId: string,
    public readonly receiverId: string,
    public readonly amount: number, // cents
  ) {
    this.occurredOn = new Date();
  }
}
