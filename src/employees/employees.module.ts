import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Employee } from './models/employee.model';
import { EmployeesService } from './services/employees.service';

@Module({
  controllers: [],
  providers: [EmployeesService],
  imports: [SequelizeModule.forFeature([Employee])],
  exports: [EmployeesService],
})
export class EmployeesModule {}
