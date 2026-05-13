import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AssignDriverDto {
  @ApiProperty({ example: 1, description: 'Driver ID to assign to the booking' })
  @IsInt()
  @IsPositive()
  driver_id: number;
}
