import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class CSVProcessingFailed implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'CSVProcessingFailed';

  constructor(
    public readonly uploadId: string,
    public readonly groupId: string,
    public readonly error: string,
  ) {
    this.occurredOn = new Date();
  }
}
