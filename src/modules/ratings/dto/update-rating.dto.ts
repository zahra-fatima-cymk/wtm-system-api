import { IsInt, IsOptional, IsString, Min, Max, IsJSON } from 'class-validator';

export class UpdateRatingDto {
  @IsInt()
  @IsOptional()
  booking_id?: number;

  @IsInt()
  @IsOptional()
  driver_id?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating_score?: number;

  @IsString()
  @IsOptional()
  review_text?: string;

  @IsJSON()
  @IsOptional()
  categories?: object;
}
