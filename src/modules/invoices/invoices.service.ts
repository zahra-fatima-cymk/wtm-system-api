import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from '../../models/invoice.model';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(@InjectModel(Invoice) private invoiceModel: typeof Invoice) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceModel.create(createInvoiceDto as any);
  }

  findAll() {
    return this.invoiceModel.findAll({ include: ['booking', 'user', 'payment'] });
  }

  findOne(id: number) {
    return this.invoiceModel.findByPk(id, { include: ['booking', 'user', 'payment'] });
  }

  findByUser(userId: number) {
    return this.invoiceModel.findAll({ where: { user_id: userId }, include: ['booking', 'user', 'payment'] });
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.findOne(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    await invoice.update(updateInvoiceDto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    const deleted = await this.invoiceModel.destroy({ where: { id } });
    if (!deleted) {
      throw new NotFoundException('Invoice not found');
    }
    return { deleted: true };
  }
}
