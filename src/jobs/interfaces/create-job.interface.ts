import { CreationAttributes } from 'sequelize';
import { Job } from '../models/job.model';

export interface CreateJob extends CreationAttributes<Job> {
  id: number;
  job: string;
}
