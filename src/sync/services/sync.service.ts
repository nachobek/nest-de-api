import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import ResponseMessages from 'src/common/enums/response-messages.enum';

@Injectable()
export class SyncService {
  private isLoadRunning = false;

  constructor() {}

  async generalLoad() {
    if (this.isLoadRunning) {
      throw new BadRequestException(ResponseMessages.SYNC_ALREADY_RUNNING);
    }

    this.isLoadRunning = true;

    try {
      // await this.loadDepartments();
      // await this.loadJobs();
      // await this.loadEmployees();
    } catch (error) {
      this.isLoadRunning = false;
      Logger.error(error, this.constructor.name);
      throw error;
    }

    this.isLoadRunning = false;
  }
}
