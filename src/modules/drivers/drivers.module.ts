import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver } from '../../models/driver.model';
import { Booking } from '../../models/booking.model';

@Module({
  imports: [SequelizeModule.forFeature([Driver, Booking])],
  providers: [DriversService],
  controllers: [DriversController],
  exports: [DriversService],
})
export class DriversModule {}
