import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { DriverAvailability, VerificationStatus } from '../../../common/enums';

export class CreateDriverDto {
  @ApiProperty({ example: 2, description: 'User ID of the existing driver account' })
  @IsInt()
  @Min(1)
  user_id: number;

  @ApiProperty({ example: 'DL123456789', description: 'Driver license number' })
  @IsString()
  @IsNotEmpty()
  license_number: string;

  @ApiProperty({ example: '2025-12-31', description: 'License expiry date' })
  @IsDateString()
  license_expiry: string;

  @ApiProperty({ example: 'Truck', description: 'Vehicle type' })
  @IsString()
  @IsNotEmpty()
  vehicle_type: string;

  @ApiProperty({ example: 'ABC 1234', description: 'Vehicle registration plate' })
  @IsString()
  @IsNotEmpty()
  vehicle_plate: string;

  @ApiProperty({ example: DriverAvailability.AVAILABLE, enum: DriverAvailability, required: false })
  @IsEnum(DriverAvailability)
  @IsOptional()
  availability_status?: DriverAvailability;

  @ApiProperty({ example: VerificationStatus.PENDING, enum: VerificationStatus, required: false })
  @IsEnum(VerificationStatus)
  @IsOptional()
  verification_status?: VerificationStatus;
}
