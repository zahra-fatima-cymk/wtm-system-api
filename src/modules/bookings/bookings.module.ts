import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../../models/booking.model';
import { Service } from '../../models/service.model';
import { Driver } from '../../models/driver.model';

@Module({
  imports: [SequelizeModule.forFeature([Booking, Service, Driver])],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
