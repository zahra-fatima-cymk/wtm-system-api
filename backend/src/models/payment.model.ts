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
import { Booking } from './booking.model';
import { User } from './user.model';
import { Driver } from './driver.model';
import { PaymentStatus, PaymentMethod } from '../common/enums';

@Table({
  tableName: 'payments',
  timestamps: true,
})
export class Payment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.INTEGER, allowNull: false })
  booking_id: number;

  @BelongsTo(() => Booking)
  booking: Booking;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Driver)
  @Column(DataType.INTEGER)
  driver_id: number;

  @BelongsTo(() => Driver)
  driver: Driver;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  amount: number;

  @Column({ type: DataType.STRING, defaultValue: 'SAR' })
  currency: string;

  @Column({ type: DataType.ENUM(...Object.values(PaymentMethod)), allowNull: false })
  payment_method: PaymentMethod;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    defaultValue: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column({ type: DataType.STRING, unique: true })
  transaction_id: string;

  @Column(DataType.DATE)
  payment_date: Date;

  @Column(DataType.STRING)
  receipt_url: string;

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
