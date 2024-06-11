import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { CreateResultDto } from './dto/create-result.dto';

@Injectable()
export class ResultsRepository extends Repository<Result> {
  constructor(private dataSource: DataSource) {
    super(Result, dataSource.createEntityManager());
  }

  async createResult(createResultDto: CreateResultDto): Promise<Result> {
    const { homePlayerSetsWon, awayPlayerSetsWon, winner, match } =
      createResultDto;
    const result = this.create({
      homePlayerSetsWon,
      awayPlayerSetsWon,
      winner,
      match,
    });

    await this.save(result);

    return result;
  }
}
