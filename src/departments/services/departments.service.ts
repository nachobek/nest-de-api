import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ResponseMessages from 'src/common/enums/response-messages.enum';
import { CreateDepartment } from '../interfaces/create-department.interface';
import { Department } from '../models/department.model';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  async bulkCreate(data: CreateDepartment[]) {
    const transaction = await this.departmentModel.sequelize.transaction();

    try {
      await this.departmentModel.bulkCreate(data, { ignoreDuplicates: true, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      Logger.error(error, this.constructor.name);
      throw new InternalServerErrorException(ResponseMessages.DEPARTMENT_CREATION_ERROR);
    }
  }
}
