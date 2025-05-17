import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Job } from './models/job.model';
import { JobsService } from './services/jobs.service';

@Module({
  controllers: [],
  providers: [JobsService],
  imports: [SequelizeModule.forFeature([Job])],
  exports: [JobsService],
})
export class JobsModule {}
