import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { isDate } from 'class-validator';
import { parse } from 'csv-parse';
import ResponseMessages from 'src/common/enums/response-messages.enum';
import { CreateDepartment } from 'src/departments/interfaces/create-department.interface';
import { DepartmentsService } from 'src/departments/services/departments.service';
import { CreateEmployee } from 'src/employees/interfaces/create-employee.interface';
import { EmployeesService } from 'src/employees/services/employees.service';
import { S3StorageService } from 'src/external-storages/services/s3-storage.service';
import { CreateJob } from 'src/jobs/interfaces/create-job.interface';
import { JobsService } from 'src/jobs/services/jobs.service';

@Injectable()
export class SyncService {
  private isLoadRunning = false;
  private batchSize = Number(process.env.BATCH_SIZE) || 1000;

  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly employeesService: EmployeesService,
    private readonly jobsService: JobsService,
    private readonly s3StorageService: S3StorageService,
  ) {}

  async generalLoad() {
    if (this.isLoadRunning) {
      throw new BadRequestException(ResponseMessages.SYNC_ALREADY_RUNNING);
    }

    this.isLoadRunning = true;

    try {
      await this.loadDepartments();
      await this.loadJobs();
      await this.loadEmployees();
    } catch (error) {
      this.isLoadRunning = false;
      Logger.error(error, this.constructor.name);
      throw error;
    }

    this.isLoadRunning = false;
  }

  private async loadDepartments() {
    const stream = await this.s3StorageService.getObjectStream(
      process.env.S3_BUCKET_NAME,
      process.env.S3_DEPARTMENTS_FILE_KEY,
    );

    // Define csv column headers. Delimiter is `,` by default.
    const parser = parse({
      columns: ['id', 'department'],
      skip_empty_lines: true,
    });

    const departments: CreateDepartment[] = [];
    let rowCount = 0;

    // For each record in the stream, apply data type transformation, validate/skip invalid records and load in btach.
    for await (const record of stream.pipe(parser)) {
      const department: CreateDepartment = {
        id: Number(record.id) || null,
        department: String(record.department),
      };

      if (
        !department.id ||
        isNaN(department.id) ||
        !department.department ||
        !department.department.trim()
      ) {
        Logger.warn(
          `Inconsistent department record found: ${JSON.stringify(record)}`,
          this.constructor.name,
        );

        continue;
      }

      departments.push(department);

      if (departments.length >= this.batchSize) {
        await this.departmentsService.bulkCreate(departments);
        rowCount += departments.length;
        departments.length = 0; // Empty the departments array
      }
    }

    // Insert remaining records.
    if (departments.length) {
      await this.departmentsService.bulkCreate(departments);
      rowCount += departments.length;
    }

    Logger.log(`Successfully loaded ${rowCount} department record(s)`, this.constructor.name);
  }

  private async loadJobs() {
    const stream = await this.s3StorageService.getObjectStream(
      process.env.S3_BUCKET_NAME,
      process.env.S3_JOBS_FILE_KEY,
    );

    const parser = parse({
      columns: ['id', 'job'],
      skip_empty_lines: true,
    });

    const jobs: CreateJob[] = [];
    let rowCount = 0;

    for await (const record of stream.pipe(parser)) {
      const job: CreateJob = {
        id: Number(record.id) || null,
        job: String(record.job),
      };

      if (!job.id || isNaN(job.id) || !job.job || !job.job.trim()) {
        Logger.warn(
          `Inconsistent job record found: ${JSON.stringify(record)}`,
          this.constructor.name,
        );

        continue;
      }

      jobs.push(job);

      if (jobs.length >= this.batchSize) {
        await this.jobsService.bulkCreate(jobs);
        rowCount += jobs.length;
        jobs.length = 0;
      }
    }

    if (jobs.length) {
      await this.jobsService.bulkCreate(jobs);
      rowCount += jobs.length;
    }

    Logger.log(`Successfully loaded ${rowCount} job record(s)`, this.constructor.name);
  }

  private async loadEmployees() {
    const stream = await this.s3StorageService.getObjectStream(
      process.env.S3_BUCKET_NAME,
      process.env.S3_EMPLOYEES_FILE_KEY,
    );

    const parser = parse({
      columns: ['id', 'name', 'hireDate', 'departmentId', 'jobId'],
      skip_empty_lines: true,
    });

    const employees: CreateEmployee[] = [];
    let rowCount = 0;

    for await (const record of stream.pipe(parser)) {
      const employee: CreateEmployee = {
        id: Number(record.id) || null,
        name: String(record.name),
        departmentId: Number(record.departmentId) || null,
        jobId: Number(record.jobId) || null,
      };

      if (record.hireDate) {
        employee.hireDate = new Date(record.hireDate);
      }

      if (
        !employee.id ||
        isNaN(employee.id) ||
        isNaN(employee.departmentId) ||
        isNaN(employee.jobId) ||
        (employee.hireDate && !isDate(employee.hireDate))
      ) {
        Logger.warn(
          `Inconsistent employee record found: ${JSON.stringify(record)}`,
          this.constructor.name,
        );

        continue;
      }

      employees.push(employee);

      if (employees.length >= this.batchSize) {
        await this.employeesService.bulkCreate(employees);
        rowCount += employees.length;
        employees.length = 0;
      }
    }

    if (employees.length) {
      await this.employeesService.bulkCreate(employees);
      rowCount += employees.length;
    }

    Logger.log(`Successfully loaded ${rowCount} employee record(s)`, this.constructor.name);
  }
}
