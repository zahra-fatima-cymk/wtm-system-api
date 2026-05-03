import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { Booking } from '../../models/booking.model';
import { DriversService } from '../drivers/drivers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType, BookingStatus } from '../../common/enums';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly driversService: DriversService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, type: Booking })
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bookings for current user' })
  @ApiResponse({ status: 200, type: [Booking] })
  findMyBookings(@Request() req) {
    if (req.user.type === UserType.ADMIN) {
      return this.bookingsService.findAll();
    }
    return this.bookingsService.findByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking details' })
  @ApiResponse({ status: 200, type: Booking })
  async findOne(@Request() req, @Param('id') id: string) {
    const booking = await this.bookingsService.findOne(+id);
    if (
      req.user.type !== UserType.ADMIN &&
      booking.user_id !== req.user.id &&
      booking.driver_id !== (await this.driversService.findByUserId(req.user.id))?.id
    ) {
      throw new ForbiddenException('Access denied');
    }
    return booking;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing booking' })
  @ApiResponse({ status: 200, type: Booking })
  update(@Request() req, @Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    const isAdmin = req.user.type === UserType.ADMIN;
    return this.bookingsService.update(req.user.id, +id, updateBookingDto, isAdmin);
  }

  @Patch(':id/assign-driver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a driver to a booking (Admin only)' })
  @ApiResponse({ status: 200, type: Booking })
  assignDriver(@Param('id') id: string, @Body() assignDriverDto: AssignDriverDto, @Request() req) {
    return this.bookingsService.assignDriver(+id, assignDriverDto, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, type: Booking })
  updateStatus(@Request() req, @Param('id') id: string, @Body() body: { status: BookingStatus }) {
    const isDriver = req.user.type === UserType.DRIVER;
    return this.bookingsService.updateStatus(+id, body.status, req.user.id, isDriver);
  }
}
