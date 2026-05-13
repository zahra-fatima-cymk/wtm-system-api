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
import { Payment } from './payment.model';
import { InvoiceStatus } from '../common/enums';

@Table({
  tableName: 'invoices',
  timestamps: true,
})
export class Invoice extends Model {
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

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  invoice_number: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  service_charge: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  tax_amount: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  discount_amount: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  total_amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(InvoiceStatus)),
    defaultValue: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  issue_date: Date;

  @Column(DataType.DATEONLY)
  due_date: Date;

  @ForeignKey(() => Payment)
  @Column(DataType.INTEGER)
  payment_id: number;

  @BelongsTo(() => Payment)
  payment: Payment;

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
