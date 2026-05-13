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
import { Driver } from './driver.model';
import { TaskStatus } from '../common/enums';

@Table({
  tableName: 'driver_tasks',
  timestamps: true,
})
export class DriverTask extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.INTEGER, allowNull: false })
  booking_id: number;

  @BelongsTo(() => Booking)
  booking: Booking;

  @ForeignKey(() => Driver)
  @Column({ type: DataType.INTEGER, allowNull: false })
  driver_id: number;

  @BelongsTo(() => Driver)
  driver: Driver;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    defaultValue: TaskStatus.ASSIGNED,
  })
  status: TaskStatus;

  @Column({ type: DataType.DATE, allowNull: false })
  assigned_at: Date;

  @Column(DataType.DATE)
  started_at: Date;

  @Column(DataType.DATE)
  completed_at: Date;

  @Column(DataType.TEXT)
  notes: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @Column(DataType.INTEGER)
  created_by: number;

  @Column(DataType.INTEGER)
  updated_by: number;
}
