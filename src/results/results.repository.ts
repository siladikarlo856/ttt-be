import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { CreateResultDto } from './dto/create-result.dto';

@Injectable()
export class ResultsRepository extends Repository<Result> {
  private logger = new Logger('ResultsRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Result, dataSource.createEntityManager());
  }

  async createResult(createResultDto: CreateResultDto): Promise<Result> {
    const { homePlayerSetsWon, awayPlayerSetsWon, winner } = createResultDto;

    this.logger.debug(
      `Creating a new db record for result: ${winner.id} => ${homePlayerSetsWon} - ${awayPlayerSetsWon}`,
    );
    const result = this.create({
      homePlayerSetsWon,
      awayPlayerSetsWon,
      winner,
    });

    await this.save(result);

    return result;
  }
}
