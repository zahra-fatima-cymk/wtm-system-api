import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DriverTasksService } from './driver-tasks.service';
import { DriverTasksController } from './driver-tasks.controller';
import { DriverTask } from '../../models/driver-task.model';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [SequelizeModule.forFeature([DriverTask]), DriversModule],
  controllers: [DriverTasksController],
  providers: [DriverTasksService],
})
export class DriverTasksModule {}
