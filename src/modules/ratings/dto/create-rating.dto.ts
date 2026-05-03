import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, IsJSON } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @IsNotEmpty()
  booking_id: number;

  @IsInt()
  @IsNotEmpty()
  driver_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating_score: number;

  @IsString()
  @IsOptional()
  review_text?: string;

  @IsJSON()
  @IsOptional()
  categories?: object;
}
