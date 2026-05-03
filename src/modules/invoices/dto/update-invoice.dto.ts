import { IsInt, IsOptional, IsString, IsEnum, IsNumber, Min, IsDateString } from 'class-validator';
import { InvoiceStatus } from '../../../common/enums';

export class UpdateInvoiceDto {
  @IsInt()
  @IsOptional()
  booking_id?: number;

  @IsInt()
  @IsOptional()
  user_id?: number;

  @IsString()
  @IsOptional()
  invoice_number?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  service_charge?: number;

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
  @IsOptional()
  total_amount?: number;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsDateString()
  @IsOptional()
  issue_date?: string;

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
