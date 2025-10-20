import { v7 as uuidv7 } from 'uuid';
import { IDomainEvent } from '../../../shared/domain/interfaces/domain-event.interface';

export class CSVProcessingCompleted implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventName: string = 'CSVProcessingCompleted';
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(
    public readonly uploadId: string,
    public readonly groupId: string,
    public readonly processedCount: number,
    public readonly failedCount: number,
  ) {
    this.eventId = uuidv7();
    this.occurredOn = new Date();
    this.aggregateId = uploadId;
  }
}
