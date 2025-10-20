import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { IEventHandler } from '../../application/interfaces/event-handler.interface';

@Injectable()
export class SQSConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SQSConsumerService.name);
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;
  private readonly handlers: IEventHandler[] = [];
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling = false;

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

  registerHandler(handler: IEventHandler): void {
    this.handlers.push(handler);
    this.logger.log(`Registered event handler: ${handler.constructor.name}`);
  }

  onModuleInit() {
    this.logger.log('Starting SQS consumer...');
    this.startPolling();
  }

  onModuleDestroy() {
    this.logger.log('Stopping SQS consumer...');
    this.stopPolling();
  }

  private startPolling(): void {
    if (this.isPolling) {
      return;
    }

    this.isPolling = true;
    this.poll();
  }

  private stopPolling(): void {
    this.isPolling = false;
    if (this.pollingInterval) {
      clearTimeout(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private async poll(): Promise<void> {
    if (!this.isPolling) {
      return;
    }

    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        MessageAttributeNames: ['All'],
      });

      const response = await this.sqsClient.send(command);

      if (response.Messages && response.Messages.length > 0) {
        this.logger.log(`Received ${response.Messages.length} messages from SQS`);

        for (const message of response.Messages) {
          await this.processMessage(message);
        }
      }
    } catch (error) {
      this.logger.error('Error polling SQS:', error);
    }

    this.pollingInterval = setTimeout(() => this.poll(), 1000);
  }

  private async processMessage(message: any): Promise<void> {
    try {
      const body = JSON.parse(message.Body);
      const eventName = body.eventName;

      this.logger.log(`Processing message with event: ${eventName}`);

      const handler = this.handlers.find((h) => h.canHandle(eventName));

      if (!handler) {
        this.logger.warn(`No handler found for event: ${eventName}`);
        await this.deleteMessage(message.ReceiptHandle);
        return;
      }

      await handler.handle(body.payload);

      await this.deleteMessage(message.ReceiptHandle);
      this.logger.log(`Successfully processed and deleted message for event: ${eventName}`);
    } catch (error) {
      this.logger.error('Error processing message:', error);
    }
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.sqsClient.send(command);
    } catch (error) {
      this.logger.error('Error deleting message from SQS:', error);
    }
  }
}
