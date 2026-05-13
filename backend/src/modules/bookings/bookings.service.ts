import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from '../../models/booking.model';
import { Service } from '../../models/service.model';
import { Driver } from '../../models/driver.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { BookingStatus, PaymentStatus } from '../../common/enums';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking)
    private bookingModel: typeof Booking,
    @InjectModel(Service)
    private serviceModel: typeof Service,
    @InjectModel(Driver)
    private driverModel: typeof Driver,
  ) {}

  async create(userId: number, createBookingDto: CreateBookingDto) {
    const service = await this.serviceModel.findByPk(createBookingDto.service_id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    const total_amount = Number(service.price) * createBookingDto.quantity;
    return this.bookingModel.create({
      ...createBookingDto,
      user_id: userId,
      total_amount,
      payment_status: PaymentStatus.PENDING,
      status: BookingStatus.PENDING,
      created_by: userId,
      updated_by: userId,
    } as any);
  }

  findAll() {
    return this.bookingModel.findAll({ include: [Service, Driver] });
  }

  findByUser(userId: number) {
    return this.bookingModel.findAll({
      where: { user_id: userId },
      include: [Service, Driver],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: number) {
    const booking = await this.bookingModel.findByPk(id, {
      include: [Service, Driver],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  findByDriver(driverId: number) {
    return this.bookingModel.findAll({
      where: { driver_id: driverId },
      include: [Service, Driver],
      order: [['created_at', 'DESC']],
    });
  }

  async update(userId: number, id: number, updateBookingDto: UpdateBookingDto, isAdmin = false) {
    const booking = await this.findOne(id);
    if (!isAdmin && booking.user_id !== userId) {
      throw new ForbiddenException('You can only update your own booking');
    }

    if (updateBookingDto.service_id || updateBookingDto.quantity) {
      const service = await this.serviceModel.findByPk(updateBookingDto.service_id ?? booking.service_id);
      if (!service) {
        throw new NotFoundException('Service not found');
      }
      const quantity = updateBookingDto.quantity ?? booking.quantity;
      updateBookingDto = {
        ...updateBookingDto,
        total_amount: Number(service.price) * quantity,
      } as UpdateBookingDto & { total_amount: number };
    }

    await booking.update({
      ...updateBookingDto,
      updated_by: userId,
    } as any);
    return this.findOne(id);
  }

  async assignDriver(id: number, assignDriverDto: AssignDriverDto, adminId: number) {
    const booking = await this.findOne(id);
    const driver = await this.driverModel.findByPk(assignDriverDto.driver_id);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    await booking.update({
      driver_id: driver.id,
      status: BookingStatus.CONFIRMED,
      updated_by: adminId,
    } as any);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: BookingStatus, userId: number, isDriver = false) {
    const booking = await this.findOne(id);
    if (isDriver) {
      const driver = await this.driverModel.findOne({ where: { user_id: userId } });
      if (!driver || booking.driver_id !== driver.id) {
        throw new ForbiddenException('You can only update your own assigned booking');
      }
    }
    await booking.update({
      status,
      updated_by: userId,
    } as any);
    return this.findOne(id);
  }
}
