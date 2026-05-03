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
import { NotificationType } from '../common/enums';

@Table({
  tableName: 'notifications',
  timestamps: true,
})
export class Notification extends Model {
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

  @Column({
    type: DataType.ENUM(...Object.values(NotificationType)),
    allowNull: false,
  })
  type: NotificationType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_read: boolean;

  @Column(DataType.DATE)
  read_at: Date;

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
