import { Inject, Injectable } from '@nestjs/common';
import {
  UploadExpenseCSVInputDto,
  UploadExpenseCSVOutputDto,
} from '../dto/upload-csv.dto';
import { S3_STORAGE_PORT } from '../ports/s3-storage.port';
import type { IS3StoragePort } from '../ports/s3-storage.port';
import { EVENT_BUS } from '../../../shared/application/ports/event-bus.port';
import type { IEventBus } from '../../../shared/application/ports/event-bus.port';
import { CSVUploadStarted } from '../../domain/events/csv-upload-started.event';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadExpenseCSVUseCase {
  constructor(
    @Inject(S3_STORAGE_PORT)
    private readonly s3Storage: IS3StoragePort,
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    input: UploadExpenseCSVInputDto,
  ): Promise<UploadExpenseCSVOutputDto> {
    // Validate file type
    if (!input.fileName.endsWith('.csv')) {
      throw new Error('Only CSV files are supported');
    }

    // Generate upload ID
    const uploadId = uuidv4();

    // Generate S3 key: {groupId}/{uploadId}/{filename}
    const s3Key = this.s3Storage.generateKey(
      input.groupId,
      uploadId,
      input.fileName,
    );

    // Upload to S3
    await this.s3Storage.upload(s3Key, input.fileBuffer, 'text/csv');

    // Publish event (triggers async processing)
    const event = new CSVUploadStarted(
      uploadId,
      input.groupId,
      input.fileName,
      s3Key,
    );
    await this.eventBus.publish(event);

    // Return 202 Accepted (async processing)
    return {
      uploadId,
      s3Key,
      status: 'pending',
      message: 'CSV uploaded successfully. Processing will begin shortly.',
    };
  }
}
