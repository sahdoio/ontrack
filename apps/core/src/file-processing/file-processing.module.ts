import { Module } from '@nestjs/common';
import { UploadExpenseCSVUseCase } from './application/use-cases/upload-expense-csv.use-case';

@Module({
  providers: [UploadExpenseCSVUseCase],
  exports: [UploadExpenseCSVUseCase],
})
export class FileProcessingModule {}
