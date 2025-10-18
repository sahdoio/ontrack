// Port for S3 storage operations
export interface IS3StoragePort {
  upload(key: string, buffer: Buffer, contentType?: string): Promise<void>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  generateKey(groupId: string, uploadId: string, fileName: string): string;
}

export const S3_STORAGE_PORT = Symbol('IS3StoragePort');
