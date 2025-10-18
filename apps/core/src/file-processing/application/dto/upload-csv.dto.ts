export class UploadExpenseCSVInputDto {
  groupId: string;
  fileName: string;
  fileBuffer: Buffer;
}

export class UploadExpenseCSVOutputDto {
  uploadId: string;
  s3Key: string;
  status: 'pending' | 'processing';
  message: string;
}
