import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { UserHistory } from '../../models/user-history.model';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [SequelizeModule.forFeature([UserHistory]), DriversModule],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
