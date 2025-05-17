import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import ResponseMessages from 'src/common/enums/response-messages.enum';
import { Department } from 'src/departments/models/department.model';
import { Job } from 'src/jobs/models/job.model';
import { EmployeeHiredByDeptartmentByQuarter } from '../dtos/employee-hired-department-quarter.dto';
import { EmployeeHiredByDeptartmentByYearAboveMean } from '../dtos/employee-hired-department-year-above-mean.dto';
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

  async findAllEmployeesHiredByDeptartmentByQuarter() {
    const [results] = await this.employeeModel.sequelize.query(
      `SELECT
        departments.department,
        jobs.job,
        COUNT(CASE WHEN date_part('month', employees."hireDate") BETWEEN 1 AND 3 THEN 1 END) AS "Q1",
        COUNT(CASE WHEN date_part('month', employees."hireDate") BETWEEN 4 AND 6 THEN 1 END) AS "Q2",
        COUNT(CASE WHEN date_part('month', employees."hireDate") BETWEEN 7 AND 9 THEN 1 END) AS "Q3",
        COUNT(CASE WHEN date_part('month', employees."hireDate") BETWEEN 10 AND 12 THEN 1 END) AS "Q4"
      FROM "Employees" AS employees
      INNER JOIN "Departments" AS departments ON employees."departmentId" = departments.id
      INNER JOIN "Jobs" AS jobs ON employees."jobId" = jobs.id
      WHERE date_part('year', employees."hireDate") = 2021
      GROUP BY departments.department, jobs.job
      ORDER BY departments.department, jobs.job;`,
      { raw: true },
    );

    return results as EmployeeHiredByDeptartmentByQuarter[];
  }

  async findAllEmployeesHiredByDeptartmentByYearAboveMean() {
    const [results] = await this.employeeModel.sequelize.query(
      `WITH hired_count_by_dep AS (
        SELECT
          departments.id,
          COUNT(employees."hireDate") AS "hire_count"
        FROM "Departments" AS departments
        INNER JOIN "Employees" AS employees ON departments.id = employees."departmentId"
        WHERE date_part('year', employees."hireDate") = 2021
        GROUP BY departments.id
        ),
        mean_hired AS (
          SELECT AVG(hire_count) AS "mean_hired"
          FROM hired_count_by_dep
        )
        SELECT
          departments.id,
          departments.department,
          hire_count AS "hired"
        FROM hired_count_by_dep
        INNER JOIN "Departments" AS departments ON departments.id = hired_count_by_dep.id
        INNER JOIN mean_hired ON hired_count_by_dep.hire_count > mean_hired.mean_hired
        ORDER BY hire_count DESC;`,
      { raw: true },
    );

    return results as EmployeeHiredByDeptartmentByYearAboveMean[];
  }
}
