import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import ResponseMessages from 'src/common/enums/response-messages.enum';
import { CreateEmployee } from '../interfaces/create-employee.interface';
import { Employee } from '../models/employee.model';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee)
    private readonly employeeModel: typeof Employee,
  ) {}

  async bulkCreate(data: CreateEmployee[]) {
    const transaction = await this.employeeModel.sequelize.transaction();

    try {
      await this.employeeModel.bulkCreate(data, { ignoreDuplicates: true, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      Logger.error(error, this.constructor.name,);
      throw new InternalServerErrorException(ResponseMessages.EMPLOYEE_CREATION_ERROR);
    }
  }
}
