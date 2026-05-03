import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../../common/enums';

export class UpdateDriverTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsISO8601()
  @IsOptional()
  started_at?: string;

  @IsISO8601()
  @IsOptional()
  completed_at?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
