import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { UserHistory } from '../../models/user-history.model';

@Module({
  imports: [SequelizeModule.forFeature([UserHistory])],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
