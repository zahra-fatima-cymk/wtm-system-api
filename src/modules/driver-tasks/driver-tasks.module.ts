import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DriverTasksService } from './driver-tasks.service';
import { DriverTasksController } from './driver-tasks.controller';
import { DriverTask } from '../../models/driver-task.model';

@Module({
  imports: [SequelizeModule.forFeature([DriverTask])],
  controllers: [DriverTasksController],
  providers: [DriverTasksService],
})
export class DriverTasksModule {}
