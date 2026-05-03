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
import { Booking } from './booking.model';
import { Driver } from './driver.model';

@Table({
  tableName: 'user_history',
  timestamps: true,
})
export class UserHistory extends Model {
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

  @ForeignKey(() => Booking)
  @Column(DataType.INTEGER)
  booking_id: number;

  @BelongsTo(() => Booking)
  booking: Booking;

  @ForeignKey(() => Driver)
  @Column(DataType.INTEGER)
  driver_id: number;

  @BelongsTo(() => Driver)
  driver: Driver;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  action_type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column(DataType.STRING)
  status: string;

  @Column(DataType.DECIMAL(10, 2))
  amount: number;

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
