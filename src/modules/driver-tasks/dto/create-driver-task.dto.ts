import { IsInt, IsNotEmpty, IsOptional, IsEnum, IsISO8601, IsString } from 'class-validator';
import { TaskStatus } from '../../../common/enums';

export class CreateDriverTaskDto {
  @IsInt()
  @IsNotEmpty()
  booking_id: number;

  @IsInt()
  @IsNotEmpty()
  driver_id: number;

  @IsISO8601()
  @IsNotEmpty()
  assigned_at: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
