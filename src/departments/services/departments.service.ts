import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ResponseMessages from 'src/common/enums/response-messages.enum';
import { Department } from '../models/department.model';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  async bulkCreate(data: Partial<Department>[]) {
    const transaction = await this.departmentModel.sequelize.transaction();

    try {
      await this.departmentModel.bulkCreate(data, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      Logger.error(ResponseMessages.DEPARTMENT_CREATION_ERROR);
      throw new InternalServerErrorException(
        ResponseMessages.DEPARTMENT_CREATION_ERROR,
        this.constructor.name,
      );
    }
  }
}
