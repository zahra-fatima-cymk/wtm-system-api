import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, Min, IsDateString } from 'class-validator';
import { InvoiceStatus } from '../../../common/enums';

export class CreateInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  booking_id: number;

  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  invoice_number: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  service_charge: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tax_amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount_amount?: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  total_amount: number;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsDateString()
  @IsNotEmpty()
  issue_date: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;

  @IsInt()
  @IsOptional()
  payment_id?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
