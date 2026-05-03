import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from '../../models/driver.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../common/enums';

@ApiTags('Drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new driver profile (Admin only)' })
  @ApiResponse({ status: 201, type: Driver })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all drivers (Admin only)' })
  @ApiResponse({ status: 200, type: [Driver] })
  findAll() {
    return this.driversService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current driver profile' })
  @ApiResponse({ status: 200, type: Driver })
  async findMyProfile(@Request() req) {
    const driver = await this.driversService.findByUserId(req.user.id);
    if (!driver) {
      throw new NotFoundException('Driver profile not found for current user');
    }
    return driver;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get driver profile' })
  @ApiResponse({ status: 200, type: Driver })
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a driver profile' })
  @ApiResponse({ status: 200, type: Driver })
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto, @Request() req) {
    const isAdmin = req.user.type === UserType.ADMIN;
    return this.driversService.update(+id, updateDriverDto, req.user.id, isAdmin);
  }

  @Get('me/bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bookings assigned to current driver' })
  @ApiResponse({ status: 200, type: [Object] })
  findAssignedBookings(@Request() req) {
    return this.driversService.findAssignedBookings(req.user.id);
  }
}
