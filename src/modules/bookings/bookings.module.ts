import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../../models/booking.model';
import { Service } from '../../models/service.model';
import { Driver } from '../../models/driver.model';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [SequelizeModule.forFeature([Booking, Service, Driver]), DriversModule],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
