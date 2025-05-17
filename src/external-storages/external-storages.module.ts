import { Module } from '@nestjs/common';
import { S3StorageService } from './services/s3-storage.service';

@Module({
  controllers: [],
  providers: [S3StorageService],
  imports: [],
  exports: [S3StorageService],
})
export class ExternalStoragesModule {}
