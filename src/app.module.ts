import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { SequelizeConfigService } from './config/services/sequelize-config.service';
import { SwaggerService } from './config/services/swagger.service';
import { SyncModule } from './sync/sync.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SyncModule,
  ],
  providers: [SwaggerService],
})
export class AppModule {}
