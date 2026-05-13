import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DriverTask } from '../../models/driver-task.model';
import { CreateDriverTaskDto } from './dto/create-driver-task.dto';
import { UpdateDriverTaskDto } from './dto/update-driver-task.dto';

@Injectable()
export class DriverTasksService {
  constructor(@InjectModel(DriverTask) private taskModel: typeof DriverTask) {}

  create(createDriverTaskDto: CreateDriverTaskDto) {
    return this.taskModel.create(createDriverTaskDto as any);
  }

  findAll() {
    return this.taskModel.findAll({ include: ['booking', 'driver'] });
  }

  findOne(id: number) {
    return this.taskModel.findByPk(id, { include: ['booking', 'driver'] });
  }

  findByDriver(driverId: number) {
    return this.taskModel.findAll({ where: { driver_id: driverId }, include: ['booking', 'driver'] });
  }

  async update(id: number, updateDriverTaskDto: UpdateDriverTaskDto) {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException('Driver task not found');
    }
    await task.update(updateDriverTaskDto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    const deleted = await this.taskModel.destroy({ where: { id } });
    if (!deleted) {
      throw new NotFoundException('Driver task not found');
    }
    return { deleted: true };
  }
}
