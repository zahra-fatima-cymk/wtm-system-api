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
import { User } from './user.model';

@Table({
  tableName: 'ratings_reviews',
  timestamps: true,
})
export class RatingReview extends Model {
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

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.INTEGER, allowNull: false })
  rating_score: number;

  @Column(DataType.TEXT)
  review_text: string;

  @Column(DataType.JSON)
  categories: object;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @Column(DataType.INTEGER)
  created_by: number;

  @Column(DataType.INTEGER)
  updated_by: number;
}
