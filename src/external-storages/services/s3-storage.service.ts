import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class S3StorageService {
  private readonly s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  async getObjectStream(bucket: string, key: string): Promise<Readable> {
    try {
      const response = await this.s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      return response.Body as Readable;
    } catch (error) {
      Logger.error(error.message, this.constructor.name);
      throw error;
    }
  }
}
