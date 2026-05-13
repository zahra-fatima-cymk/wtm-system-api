import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../common/enums';
import { DriversService } from '../drivers/drivers.service';

@ApiTags('History')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('history')
export class HistoryController {
  constructor(
    private readonly historyService: HistoryService,
    private readonly driversService: DriversService,
  ) {}

  @Get('user')
  @ApiOperation({ summary: 'Get current user history' })
  findMyHistory(@Request() req) {
    return this.historyService.findByUser(req.user?.id ?? req.user?.sub);
  }

  @Get('driver')
  @Roles(UserType.DRIVER)
  @ApiOperation({ summary: 'Get history for the authenticated driver' })
  async findDriverHistory(@Request() req) {
    const driver = await this.driversService.findByUserId(req.user.id);
    if (!driver) {
      return [];
    }
    return this.historyService.findByDriverId(driver.id);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Get all history (Admin only)' })
  findAll() {
    return this.historyService.findAll();
  }
}
