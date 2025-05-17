import { CreationAttributes } from 'sequelize';
import { Employee } from '../models/employee.model';

export interface CreateEmployee extends CreationAttributes<Employee> {
  id: number;
  name?: string;
  hireDate?: Date;
  departmentId?: number;
  jobId?: number;
}
