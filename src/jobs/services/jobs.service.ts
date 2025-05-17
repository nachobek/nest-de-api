import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ResponseMessages from 'src/common/enums/response-messages.enum';
import { CreateJob } from '../interfaces/create-job.interface';
import { Job } from '../models/job.model';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job)
    private readonly jobModel: typeof Job,
  ) {}

  async bulkCreate(data: CreateJob[]) {
    const transaction = await this.jobModel.sequelize.transaction();

    try {
      await this.jobModel.bulkCreate(data, { ignoreDuplicates: true, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      Logger.error(error, this.constructor.name);
      throw new InternalServerErrorException(ResponseMessages.JOB_CREATION_ERROR);
    }
  }
}
