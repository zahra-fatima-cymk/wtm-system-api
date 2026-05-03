import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { AccountStatus, UserType } from '../common/enums';

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.ENUM('user', 'driver', 'admin'),
    allowNull: false,
    defaultValue: UserType.USER,
  })
  declare type: UserType;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare first_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare last_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password_hash: string;

  @Column({
    type: DataType.ENUM('active', 'inactive', 'suspended'),
    allowNull: false,
    defaultValue: AccountStatus.ACTIVE,
  })
  declare status: AccountStatus;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare address?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare city?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare postal_code?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare profile_image?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare email_verified: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare created_by?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare updated_by?: number;
}
