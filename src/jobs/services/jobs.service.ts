import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ResponseMessages from 'src/common/enums/response-messages.enum';
import { Job } from '../models/job.model';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job)
    private readonly jobModel: typeof Job,
  ) {}

  async bulkCreate(data: Partial<Job>[]) {
    const transaction = await this.jobModel.sequelize.transaction();

    try {
      await this.jobModel.bulkCreate(data, { ignoreDuplicates: true, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      Logger.error(ResponseMessages.JOB_CREATION_ERROR);
      throw new InternalServerErrorException(
        ResponseMessages.JOB_CREATION_ERROR,
        this.constructor.name,
      );
    }
  }
}
