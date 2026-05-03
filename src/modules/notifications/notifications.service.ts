import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from '../../models/notification.model';
import { NotificationType } from '../../common/enums';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async create(userId: number, title: string, message: string, type: NotificationType, bookingId?: number): Promise<Notification> {
    return await this.notificationModel.create({
      user_id: userId,
      title,
      message,
      type,
      booking_id: bookingId,
      created_by: userId,
    } as any);
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return await this.notificationModel.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });
  }

  async markAsRead(id: number): Promise<Notification | null> {
    const notification = await this.notificationModel.findByPk(id);
    if (notification) {
      return await notification.update({ is_read: true, read_at: new Date() });
    }
    return null;
  }
}
