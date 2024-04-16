import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { ResultsRepository } from './results.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Result])],
  controllers: [],
  providers: [ResultsService, ResultsRepository],
  exports: [ResultsService],
})
export class ResultsModule {}
