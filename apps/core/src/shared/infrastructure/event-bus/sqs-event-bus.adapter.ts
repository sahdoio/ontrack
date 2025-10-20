import { Injectable, Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import type { IDomainEvent } from '../../domain/interfaces/domain-event.interface';
import type { IEventBus } from '../../application/ports/event-bus.port';

@Injectable()
export class SQSEventBusAdapter implements IEventBus {
  private readonly logger = new Logger(SQSEventBusAdapter.name);
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.SQS_ENDPOINT || undefined,
      credentials:
        process.env.NODE_ENV === 'development'
          ? {
              accessKeyId: 'test',
              secretAccessKey: 'test',
            }
          : undefined,
    });

    this.queueUrl =
      process.env.SQS_QUEUE_URL || 'http://localhost:4566/000000000000/events';
  }

  async publish(event: IDomainEvent): Promise<void> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify({
          eventId: event.eventId,
          eventName: event.eventName,
          occurredOn: event.occurredOn.toISOString(),
          aggregateId: event.aggregateId,
          payload: event,
        }),
        MessageAttributes: {
          eventName: {
            DataType: 'String',
            StringValue: event.eventName,
          },
          eventId: {
            DataType: 'String',
            StringValue: event.eventId,
          },
        },
      });

      await this.sqsClient.send(command);
      this.logger.log(
        `Event published to SQS: ${event.eventName} (${event.eventId})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event to SQS: ${event.eventName}`,
        error,
      );
      throw error;
    }
  }

  async publishAll(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
