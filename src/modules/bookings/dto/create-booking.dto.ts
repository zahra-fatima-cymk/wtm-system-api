import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaymentMethod } from '../../../common/enums';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'Service ID' })
  @IsInt()
  @IsPositive()
  service_id: number;

  @ApiProperty({ example: '2026-06-01', description: 'Desired booking date' })
  @IsDateString()
  booking_date: string;

  @ApiProperty({ example: '2026-06-01T09:30:00.000Z', description: 'Scheduled start time' })
  @IsDateString()
  scheduled_time: string;

  @ApiProperty({ example: 'King Fahd Rd, Jeddah', description: 'Delivery address' })
  @IsString()
  @IsNotEmpty()
  delivery_address: string;

  @ApiProperty({ example: 'Please call before arrival', required: false })
  @IsString()
  @IsOptional()
  special_requests?: string;

  @ApiProperty({ example: 1, description: 'Number of tanks/items' })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: PaymentMethod.CASH_ON_DELIVERY, enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}
