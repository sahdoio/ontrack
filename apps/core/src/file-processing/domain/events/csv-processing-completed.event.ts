import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class CSVProcessingCompleted implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'CSVProcessingCompleted';

  constructor(
    public readonly uploadId: string,
    public readonly groupId: string,
    public readonly processedCount: number,
    public readonly failedCount: number,
  ) {
    this.occurredOn = new Date();
  }
}
