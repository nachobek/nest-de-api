import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from './models/department.model';
import { DepartmentsService } from './services/departments.service';

@Module({
  controllers: [],
  providers: [DepartmentsService],
  imports: [SequelizeModule.forFeature([Department])],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
