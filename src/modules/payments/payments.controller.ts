import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from '../../models/payment.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType, PaymentStatus } from '../../common/enums';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a payment record for a booking' })
  @ApiResponse({ status: 201, type: Payment })
  create(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(req.user.id, createPaymentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payments for current user' })
  @ApiResponse({ status: 200, type: [Payment] })
  findAll(@Request() req) {
    const isAdmin = req.user.type === UserType.ADMIN;
    return this.paymentsService.findAll(req.user.id, isAdmin);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({ status: 200, type: Payment })
  findOne(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.type === UserType.ADMIN;
    return this.paymentsService.findOne(+id, req.user.id, isAdmin);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a payment record' })
  @ApiResponse({ status: 200, type: Payment })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto, @Request() req) {
    const isAdmin = req.user.type === UserType.ADMIN;
    return this.paymentsService.update(+id, updatePaymentDto, req.user.id, isAdmin);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify or reject a payment (Admin only)' })
  @ApiResponse({ status: 200, type: Payment })
  verify(@Param('id') id: string, @Body() body: { status: PaymentStatus }, @Request() req) {
    return this.paymentsService.verifyPayment(+id, body.status, req.user.id, true);
  }
}
