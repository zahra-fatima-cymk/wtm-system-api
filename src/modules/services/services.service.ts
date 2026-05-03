import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from '../../models/service.model';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectModel(Service) private serviceModel: typeof Service) {}

  create(createServiceDto: CreateServiceDto) {
    return this.serviceModel.create(createServiceDto as any);
  }

  findAll() {
    return this.serviceModel.findAll();
  }

  findOne(id: number) {
    return this.serviceModel.findByPk(id);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.findOne(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    await service.update(updateServiceDto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    const deleted = await this.serviceModel.destroy({ where: { id } });
    if (!deleted) {
      throw new NotFoundException('Service not found');
    }
    return { deleted: true };
  }
}
