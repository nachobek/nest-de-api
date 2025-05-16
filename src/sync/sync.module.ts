import { Module } from '@nestjs/common';
import { SyncController } from './controllers/sync.controller';
import { SyncService } from './services/sync.service';

@Module({
  controllers: [SyncController],
  providers: [SyncService],
  imports: [],
  exports: [SyncService],
})
export class SyncModule {}
