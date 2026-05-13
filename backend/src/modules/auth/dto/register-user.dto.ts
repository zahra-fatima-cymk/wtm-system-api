import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Ahmed', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Al-Saud', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+966500000000', description: 'User phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

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
}
