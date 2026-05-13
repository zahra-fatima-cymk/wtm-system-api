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

  async findOne(id: number, userId: number, isAdmin = false) {
    const invoice = await this.invoiceModel.findByPk(id, { include: ['booking', 'user', 'payment'] });
    if (!invoice) {
      return null;
    }
    if (!isAdmin && invoice.user_id !== userId) {
      return null;
    }
    return invoice;
  }

  findByUser(userId: number) {
    return this.invoiceModel.findAll({ where: { user_id: userId }, include: ['booking', 'user', 'payment'] });
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.invoiceModel.findByPk(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    await invoice.update(updateInvoiceDto as any);
    return this.invoiceModel.findByPk(id, { include: ['booking', 'user', 'payment'] });
  }

  async remove(id: number) {
    const deleted = await this.invoiceModel.destroy({ where: { id } });
    if (!deleted) {
      throw new NotFoundException('Invoice not found');
    }
    return { deleted: true };
  }
}
