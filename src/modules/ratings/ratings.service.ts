import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RatingReview } from '../../models/rating-review.model';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(@InjectModel(RatingReview) private ratingModel: typeof RatingReview) {}

  create(createRatingDto: CreateRatingDto) {
    return this.ratingModel.create(createRatingDto as any);
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
