import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { PaymentMethod } from '../../../common/enums';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'Booking ID' })
  @IsInt()
  @IsPositive()
  booking_id: number;

  @ApiProperty({ example: 300.0, description: 'Payment amount' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: PaymentMethod.ONLINE, enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({ example: 'TRANS-1234', description: 'Transaction ID', required: false })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiProperty({ example: 'https://example.com/receipt.pdf', description: 'Receipt URL', required: false })
  @IsString()
  @IsOptional()
  receipt_url?: string;
}
