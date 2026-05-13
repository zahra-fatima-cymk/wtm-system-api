import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from '../../models/service.model';

@Module({
  imports: [SequelizeModule.forFeature([Service])],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
