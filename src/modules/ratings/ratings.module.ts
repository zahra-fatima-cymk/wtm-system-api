import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { RatingReview } from '../../models/rating-review.model';

@Module({
  imports: [SequelizeModule.forFeature([RatingReview])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
