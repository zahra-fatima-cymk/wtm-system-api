import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { AccountStatus, UserType } from '../../common/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'user', enum: UserType, required: false })
  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @ApiProperty({ example: 'Ahmed', description: 'User first name' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Al-Saud', description: 'User last name' })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+966500000000', description: 'User phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'active', enum: AccountStatus, required: false })
  @IsEnum(AccountStatus)
  @IsOptional()
  status?: AccountStatus;

  @ApiProperty({ example: false, description: 'Email verified status', required: false })
  @IsBoolean()
  @IsOptional()
  email_verified?: boolean;

  @ApiProperty({ example: 'Al Zahra Street, Jeddah', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Jeddah', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '21564', required: false })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  @IsString()
  @IsOptional()
  profile_image?: string;
}
