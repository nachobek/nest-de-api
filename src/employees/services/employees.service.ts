import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import ResponseMessages from 'src/common/enums/response-messages.enum';
import { Department } from 'src/departments/models/department.model';
import { Job } from 'src/jobs/models/job.model';
import { CreateEmployee } from '../interfaces/create-employee.interface';
import { Employee } from '../models/employee.model';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee)
    private readonly employeeModel: typeof Employee,
  ) {}

  async bulkCreate(data: CreateEmployee[]) {
    const uniqueDepartmentIds = new Set(
      data.map((employee) => employee.departmentId).filter((departmentId) => departmentId !== null),
    );
    const uniqueJobIds = new Set(
      data.map((employee) => employee.jobId).filter((jobId) => jobId !== null),
    );

    const [departments, jobs] = await Promise.all([
      Department.findAll({ where: { id: { [Op.in]: Array.from(uniqueDepartmentIds) } } }),
      Job.findAll({ where: { id: { [Op.in]: Array.from(uniqueJobIds) } } }),
    ]);

    if (departments.length !== uniqueDepartmentIds.size) {
      Logger.error('Invalid departmentId foreing key', this.constructor.name);
      throw new InternalServerErrorException(ResponseMessages.EMPLOYEE_CREATION_ERROR);
    }

    if (jobs.length !== uniqueJobIds.size) {
      Logger.error('Invalid jobId foreing key', this.constructor.name);
      throw new InternalServerErrorException(ResponseMessages.EMPLOYEE_CREATION_ERROR);
    }

    const transaction = await this.employeeModel.sequelize.transaction();

    try {
      await this.employeeModel.bulkCreate(data, { ignoreDuplicates: true, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      Logger.error(error, this.constructor.name);
      throw new InternalServerErrorException(ResponseMessages.EMPLOYEE_CREATION_ERROR);
    }
  }
}
