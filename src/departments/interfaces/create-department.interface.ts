import { CreationAttributes } from 'sequelize';
import { Department } from '../models/department.model';

export interface CreateDepartment extends CreationAttributes<Department> {
  id: number;
  department: string;
}
