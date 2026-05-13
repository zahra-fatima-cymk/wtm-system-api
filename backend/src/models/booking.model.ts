import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Service } from './service.model';
import { Driver } from './driver.model';
import { BookingStatus, PaymentStatus, PaymentMethod } from '../common/enums';

@Table({
  tableName: 'bookings',
  timestamps: true,
})
export class Booking extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @ForeignKey(() => Service)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  service_id: number;

  @BelongsTo(() => Service)
  service: Service;

  @ForeignKey(() => Driver)
  @Column(DataType.INTEGER)
  driver_id: number;

  @BelongsTo(() => Driver)
  driver: Driver;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  booking_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduled_time: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  delivery_address: string;

  @Column(DataType.TEXT)
  special_requests: string;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    defaultValue: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total_amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    defaultValue: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: false,
  })
  payment_method: PaymentMethod;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  created_by: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  updated_by: number;
}
