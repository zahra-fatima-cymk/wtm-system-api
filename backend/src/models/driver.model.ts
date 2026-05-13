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
import { DriverAvailability, VerificationStatus } from '../common/enums';

@Table({
  tableName: 'drivers',
  timestamps: true,
})
export class Driver extends Model {
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

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  license_number: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  license_expiry: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  vehicle_type: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  vehicle_plate: string;

  @Column({
    type: DataType.ENUM(...Object.values(DriverAvailability)),
    defaultValue: DriverAvailability.AVAILABLE,
  })
  availability_status: DriverAvailability;

  @Column({
    type: DataType.DECIMAL(3, 2),
    defaultValue: 0,
  })
  rating: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_ratings: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_completed_tasks: number;

  @Column(DataType.STRING)
  bank_account: string;

  @Column({
    type: DataType.ENUM(...Object.values(VerificationStatus)),
    defaultValue: VerificationStatus.PENDING,
  })
  verification_status: VerificationStatus;

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
