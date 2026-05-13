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
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DriverTasksService } from './driver-tasks.service';
import { CreateDriverTaskDto } from './dto/create-driver-task.dto';
import { UpdateDriverTaskDto } from './dto/update-driver-task.dto';
import { DriverTask } from '../../models/driver-task.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../common/enums';
import { DriversService } from '../drivers/drivers.service';

@ApiTags('Driver Tasks')
@Controller('driver-tasks')
export class DriverTasksController {
  constructor(
    private readonly driverTasksService: DriverTasksService,
    private readonly driversService: DriversService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all driver tasks (Admin only)' })
  @ApiResponse({ status: 200, type: [DriverTask] })
  findAll() {
    return this.driverTasksService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tasks for the authenticated driver' })
  @ApiResponse({ status: 200, type: [DriverTask] })
  findMine(@Request() req: any) {
    return this.driverTasksService.findByDriver(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific driver task by ID' })
  @ApiResponse({ status: 200, type: DriverTask })
  async findOne(@Param('id') id: string, @Request() req) {
    const task = await this.driverTasksService.findOne(+id);
    if (!task) {
      throw new ForbiddenException('Driver task not found or access denied');
    }
    if (req.user.type === UserType.ADMIN) {
      return task;
    }
    const driver = await this.driversService.findByUserId(req.user.id);
    if (!driver || task.driver_id !== driver.id) {
      throw new ForbiddenException('Access denied');
    }
    return task;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a driver task (Admin only)' })
  @ApiResponse({ status: 201, type: DriverTask })
  create(@Body() createDriverTaskDto: CreateDriverTaskDto) {
    return this.driverTasksService.create(createDriverTaskDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a driver task' })
  @ApiResponse({ status: 200, type: DriverTask })
  async update(@Param('id') id: string, @Body() updateDriverTaskDto: UpdateDriverTaskDto, @Request() req) {
    const task = await this.driverTasksService.findOne(+id);
    if (!task) {
      throw new ForbiddenException('Driver task not found');
    }
    if (req.user.type === UserType.DRIVER) {
      const driver = await this.driversService.findByUserId(req.user.id);
      if (!driver || task.driver_id !== driver.id) {
        throw new ForbiddenException('Access denied');
      }
    }
    return this.driverTasksService.update(+id, updateDriverTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a driver task (Admin only)' })
  remove(@Param('id') id: string) {
    return this.driverTasksService.remove(+id);
  }
}
