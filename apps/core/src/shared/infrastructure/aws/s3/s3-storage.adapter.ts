import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { IS3StoragePort } from '../../../../file-processing/application/ports/s3-storage.port';

@Injectable()
export class S3StorageAdapter implements IS3StoragePort {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
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

    this.bucketName =
      this.configService.get<string>('aws.s3.bucketName') || 'ontrack-uploads';
  }

  async upload(
    key: string,
    buffer: Buffer,
    contentType?: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
    });

    await this.s3Client.send(command);
  }

  async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const stream = response.Body as any;

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  generateKey(groupId: string, uploadId: string, fileName: string): string {
    return `${groupId}/${uploadId}/${fileName}`;
  }
}
