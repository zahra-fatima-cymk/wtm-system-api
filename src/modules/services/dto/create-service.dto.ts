import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ServiceType } from '../../../common/enums';

export class CreateServiceDto {
  @ApiProperty({ example: 'Standard Delivery', description: 'Service name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Water tank delivery and installation', description: 'Service description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: ServiceType.DELIVERY, enum: ServiceType })
  @IsEnum(ServiceType)
  service_type: ServiceType;

  @ApiProperty({ example: 150.0, description: 'Service price in SAR' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 45, description: 'Estimated duration in minutes' })
  @IsNumber()
  @Min(1)
  estimated_duration: number;

  @ApiProperty({ example: true, description: 'Whether this service is currently active', required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ example: false, description: 'Is emergency service', required: false })
  @IsBoolean()
  @IsOptional()
  is_emergency?: boolean;
}
