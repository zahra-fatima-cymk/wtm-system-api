import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { RatingReview } from '../../models/rating-review.model';
import { Booking } from '../../models/booking.model';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [SequelizeModule.forFeature([RatingReview, Booking]), DriversModule],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
