import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from '../../models/payment.model';
import { Booking } from '../../models/booking.model';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from '../../common/enums';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @InjectModel(Booking)
    private bookingModel: typeof Booking,
  ) {}

  async create(userId: number, createPaymentDto: CreatePaymentDto) {
    const booking = await this.bookingModel.findByPk(createPaymentDto.booking_id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.user_id !== userId) {
      throw new ForbiddenException('You can only create payments for your own bookings');
    }

    const payment = await this.paymentModel.create({
      ...createPaymentDto,
      user_id: userId,
      payment_status: PaymentStatus.PENDING,
      created_by: userId,
      updated_by: userId,
    } as any);

    await booking.update({ payment_status: PaymentStatus.PENDING, updated_by: userId } as any);
    return payment;
  }

  findAll(userId: number, isAdmin = false) {
    if (isAdmin) {
      return this.paymentModel.findAll({ include: [Booking] });
    }
    return this.paymentModel.findAll({ where: { user_id: userId }, include: [Booking] });
  }

  async findOne(id: number, userId: number, isAdmin = false) {
    const payment = await this.paymentModel.findByPk(id, { include: [Booking] });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    if (!isAdmin && payment.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto, userId: number, isAdmin = false) {
    const payment = await this.findOne(id, userId, isAdmin);
    await payment.update({ ...updatePaymentDto, updated_by: userId } as any);
    return this.findOne(id, userId, isAdmin);
  }

  async verifyPayment(id: number, status: PaymentStatus, userId: number, isAdmin = false) {
    const payment = await this.findOne(id, userId, isAdmin);
    await payment.update({ payment_status: status, updated_by: userId } as any);
    return payment;
  }
}
