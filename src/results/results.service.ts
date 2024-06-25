import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Result } from './entities/result.entity';
import { ResultsRepository } from './results.repository';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResultsService {
  private logger = new Logger('ResultsService', { timestamp: true });

  constructor(
    @InjectRepository(ResultsRepository)
    private resultsRepository: ResultsRepository,
  ) {}

  async create(createResultDto: CreateResultDto): Promise<Result> {
    this.logger.debug(
      `Creating a new result for match:${createResultDto.match.id}}`,
    );
    return this.resultsRepository.createResult(createResultDto);
  }

  async findAll(): Promise<Result[]> {
    this.logger.debug(`Retrieving all results`);
    return this.resultsRepository.find();
  }

  async findOne(id: string): Promise<Result> {
    const found = await this.resultsRepository.findOne({
      where: { id },
      relations: ['winner'],
    });

    if (!found) {
      throw new NotFoundException(`Result with id: '${id}' not found`);
    }

    return found;
  }

  async update(id: string, updateResultsDto: UpdateResultDto): Promise<Result> {
    const result = await this.findOne(id);

    Object.assign(result, updateResultsDto);

    await this.resultsRepository.save(result);

    return result;
  }

  async remove(id: string): Promise<void> {
    this.logger.debug(`Deleting result with id: ${id}`);
    const result = await this.resultsRepository.softDelete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Result with id: '${id}' not found`);
    }
  }

  async findOneByMatchId(matchId: string): Promise<Result> {
    return this.resultsRepository.findOneByMatchId(matchId);
  }
}
