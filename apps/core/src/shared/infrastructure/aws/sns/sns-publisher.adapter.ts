import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { IDomainEvent } from '../../../domain/interfaces/domain-event.interface';

@Injectable()
export class SNSPublisherAdapter {
  private readonly logger = new Logger(SNSPublisherAdapter.name);
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor(private readonly configService: ConfigService) {
    this.snsClient = new SNSClient({
      region: this.configService.get<string>('aws.region') || 'us-east-1',
      credentials: {
        accessKeyId:
          this.configService.get<string>('aws.credentials.accessKeyId') ||
          'test',
        secretAccessKey:
          this.configService.get<string>('aws.credentials.secretAccessKey') ||
          'test',
      },
    });

    this.topicArn =
      this.configService.get<string>('aws.sns.topicArn') ||
      'arn:aws:sns:us-east-1:000000000000:ontrack-events';
  }

  async publish(event: IDomainEvent): Promise<void> {
    const message = JSON.stringify({
      eventName: event.eventName,
      occurredOn: event.occurredOn,
      data: event,
    });

    const command = new PublishCommand({
      TopicArn: this.topicArn,
      Message: message,
      MessageAttributes: {
        eventName: {
          DataType: 'String',
          StringValue: event.eventName,
        },
      },
    });

    try {
      await this.snsClient.send(command);
      this.logger.log(`Published event ${event.eventName} to SNS`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.eventName}`, error);
      throw error;
    }
  }

  async publishAll(events: IDomainEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.publish(event)));
  }
}
