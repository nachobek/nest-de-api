import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmployeesController } from './controllers/employees.controller';
import { Employee } from './models/employee.model';
import { EmployeesService } from './services/employees.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [SequelizeModule.forFeature([Employee])],
  exports: [EmployeesService],
})
export class EmployeesModule {}
