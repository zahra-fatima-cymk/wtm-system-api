import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserHistory } from '../../models/user-history.model';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(UserHistory)
    private historyModel: typeof UserHistory,
  ) {}

  async record(userId: number, action_type: string, description: string, bookingId?: number, driverId?: number, amount?: number): Promise<UserHistory> {
    return await this.historyModel.create({
      user_id: userId,
      action_type,
      description,
      booking_id: bookingId,
      driver_id: driverId,
      amount,
      created_by: userId,
    } as any);
  }

  async findByUser(userId: number): Promise<UserHistory[]> {
    return await this.historyModel.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });
  }

  async findAll(): Promise<UserHistory[]> {
      return await this.historyModel.findAll({ order: [['created_at', 'DESC']] });
  }

  async findByDriverId(driverId: number): Promise<UserHistory[]> {
    return await this.historyModel.findAll({
      where: { driver_id: driverId },
      order: [['created_at', 'DESC']],
    });
  }
}
