import { v7 as uuidv7 } from 'uuid';
import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class CSVProcessingFailed implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventName: string = 'CSVProcessingFailed';
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(
    public readonly uploadId: string,
    public readonly groupId: string,
    public readonly error: string,
  ) {
    this.eventId = uuidv7();
    this.occurredOn = new Date();
    this.aggregateId = uploadId;
  }
}
