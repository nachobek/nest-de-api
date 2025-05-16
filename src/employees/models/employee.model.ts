import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/models/base.model';
import { Department } from 'src/departments/models/department.model';
import { Job } from 'src/jobs/models/job.model';

@Table
export class Employee extends BaseModel {
  @Column({ allowNull: false, type: DataType.STRING })
  name: string;

  @Column({ allowNull: false, type: DataType.DATE })
  hireDate: Date;

  @ForeignKey(() => Department)
  @Column({ allowNull: false, type: DataType.INTEGER })
  departmentId: number;

  @ForeignKey(() => Job)
  @Column({ allowNull: false, type: DataType.INTEGER })
  jobId: number;

  @BelongsTo(() => Department)
  department: Department;

  @BelongsTo(() => Job)
  job: Job;
}
