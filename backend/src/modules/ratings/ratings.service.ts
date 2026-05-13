import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RatingReview } from '../../models/rating-review.model';
import { Booking } from '../../models/booking.model';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(RatingReview) private ratingModel: typeof RatingReview,
    @InjectModel(Booking) private bookingModel: typeof Booking,
  ) {}

  async create(userId: number, createRatingDto: CreateRatingDto) {
    const booking = await this.bookingModel.findByPk(createRatingDto.booking_id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.user_id !== userId) {
      throw new ForbiddenException('You can only rate your own bookings');
    }
    if (booking.driver_id !== createRatingDto.driver_id) {
      throw new ForbiddenException('Driver does not match the booking assignment');
    }
    return this.ratingModel.create({
      ...createRatingDto,
      user_id: userId,
    } as any);
  }

  findAll() {
    return this.ratingModel.findAll({ include: ['booking', 'driver', 'user'] });
  }

  findOne(id: number) {
    return this.ratingModel.findByPk(id, { include: ['booking', 'driver', 'user'] });
  }

  findByDriver(driverId: number) {
    return this.ratingModel.findAll({ where: { driver_id: driverId }, include: ['booking', 'driver', 'user'] });
  }

  findByUser(userId: number) {
    return this.ratingModel.findAll({ where: { user_id: userId }, include: ['booking', 'driver', 'user'] });
  }

  async update(id: number, updateRatingDto: UpdateRatingDto) {
    const rating = await this.findOne(id);
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    await rating.update(updateRatingDto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    const deleted = await this.ratingModel.destroy({ where: { id } });
    if (!deleted) {
      throw new NotFoundException('Rating not found');
    }
    return { deleted: true };
  }
}
