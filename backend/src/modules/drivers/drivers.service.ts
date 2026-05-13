import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Driver } from '../../models/driver.model';
import { Booking } from '../../models/booking.model';
import { User } from '../../models/user.model';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver)
    private driverModel: typeof Driver,
    @InjectModel(Booking)
    private bookingModel: typeof Booking,
  ) {}

  create(createDriverDto: CreateDriverDto) {
    return this.driverModel.create(createDriverDto as any);
  }

  findAll() {
    return this.driverModel.findAll({ include: [User, Booking] });
  }

  findOne(id: number) {
    return this.driverModel.findByPk(id, { include: [User, Booking] });
  }

  findByUserId(userId: number) {
    return this.driverModel.findOne({
      where: { user_id: userId },
      include: [User, Booking],
    });
  }

  async update(id: number, updateDriverDto: UpdateDriverDto, userId: number, isAdmin = false) {
    const driver = await this.findOne(id);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    if (!isAdmin && driver.user_id !== userId) {
      throw new ForbiddenException('You can only update your own driver profile');
    }
    await driver.update(updateDriverDto as any);
    return this.findOne(id);
  }

  async findAssignedBookings(userId: number) {
    const driver = await this.findByUserId(userId);
    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }
    return this.bookingModel.findAll({ where: { driver_id: driver.id } });
  }
}
