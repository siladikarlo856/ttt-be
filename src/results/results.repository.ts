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
    const { homePlayerSetsWon, awayPlayerSetsWon, winner, match } =
      createResultDto;

    const result = this.create({
      homePlayerSetsWon,
      awayPlayerSetsWon,
      winner,
      match,
    });

    try {
      await this.save(result);
    } catch (error) {
      console.log('problem', error);
    }

    return result;
  }

  async findOneByMatchId(matchId: string): Promise<Result> {
    this.logger.verbose(`Retrieving result for match with id: ${matchId}`);
    return this.findOne({ where: { match: { id: matchId } } });
  }
}
