import { Module } from '@nestjs/common';
import { Set } from './entities/set.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetsService } from './sets.service';
import { SetsRepository } from './sets.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Set])],
  providers: [SetsService, SetsRepository],
  exports: [SetsService],
})
export class SetsModule {}
