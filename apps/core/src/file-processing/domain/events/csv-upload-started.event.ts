import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class CSVUploadStarted implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'CSVUploadStarted';

  constructor(
    public readonly uploadId: string,
    public readonly groupId: string,
    public readonly fileName: string,
    public readonly s3Key: string,
  ) {
    this.occurredOn = new Date();
  }
}
