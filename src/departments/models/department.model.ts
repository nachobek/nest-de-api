import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/models/base.model';
import { Employee } from 'src/employees/models/employee.model';

@Table
export class Department extends BaseModel {
  @Column({ allowNull: false, type: DataType.STRING })
  department: string;

  @HasMany(() => Employee)
  employees: Employee[];
}
