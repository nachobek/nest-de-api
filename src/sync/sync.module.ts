import { Module } from '@nestjs/common';
import { DepartmentsModule } from 'src/departments/departments.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { ExternalStoragesModule } from 'src/external-storages/external-storages.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { SyncController } from './controllers/sync.controller';
import { SyncService } from './services/sync.service';

@Module({
  controllers: [SyncController],
  providers: [SyncService],
  imports: [DepartmentsModule, EmployeesModule, JobsModule, ExternalStoragesModule],
  exports: [SyncService],
})
export class SyncModule {}
