import { v7 as uuidv7 } from 'uuid';
import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class CSVUploadStarted implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventName: string = 'CSVUploadStarted';
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(
    public readonly uploadId: string,
    public readonly groupId: string,
    public readonly fileName: string,
    public readonly s3Key: string,
  ) {
    this.eventId = uuidv7();
    this.occurredOn = new Date();
    this.aggregateId = uploadId;
  }
}
