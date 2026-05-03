import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingReview } from '../../models/rating-review.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../common/enums';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all ratings' })
  @ApiResponse({ status: 200, type: [RatingReview] })
  findAll() {
    return this.ratingsService.findAll();
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'List ratings for a specific driver' })
  @ApiResponse({ status: 200, type: [RatingReview] })
  findByDriver(@Param('driverId') driverId: string) {
    return this.ratingsService.findByDriver(+driverId);
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ratings submitted by the authenticated user' })
  @ApiResponse({ status: 200, type: [RatingReview] })
  findByUser(@Request() req: any) {
    return this.ratingsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rating by ID' })
  @ApiResponse({ status: 200, type: RatingReview })
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a rating for a booking' })
  @ApiResponse({ status: 201, type: RatingReview })
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(createRatingDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a rating (Admin only)' })
  @ApiResponse({ status: 200, type: RatingReview })
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(+id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a rating (Admin only)' })
  remove(@Param('id') id: string) {
    return this.ratingsService.remove(+id);
  }
}
