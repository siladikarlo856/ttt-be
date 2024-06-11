import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SetsRepository } from './sets.repository';
import { CreateSetEntityDto } from './dto/create-set-entity.dto';
import { Set } from './entities/set.entity';
import { SetDto } from './dto/set.dto';

@Injectable()
export class SetsService {
  private logger = new Logger('SetsService', { timestamp: true });

  constructor(
    @InjectRepository(SetsRepository)
    private setsRepository: SetsRepository,
  ) {}

  async create(createSetDto: CreateSetEntityDto): Promise<Set> {
    this.logger.debug(`Creating a new set for match ${createSetDto.match.id}`);
    return this.setsRepository.createSet(createSetDto);
  }

  async findAll(): Promise<Set[]> {
    this.logger.debug(`Retrieving all sets`);
    return (await this.setsRepository.find()).sort(
      (a, b) => a.setNumber - b.setNumber,
    );
  }

  async findOne(id: string): Promise<Set> {
    this.logger.debug(`Retrieving set with id: ${id}`);
    const found = await this.setsRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Set with id: '${id}' not found`);
    }

    return found;
  }

  async update(updateSetDto: SetDto): Promise<Set> {
    this.logger.debug(`Updating set with id: ${updateSetDto.id}`);
    const set = await this.findOne(updateSetDto.id);

    Object.assign(set, updateSetDto);

    await this.setsRepository.save(set);

    return set;
  }

  async remove(id: string): Promise<void> {
    this.logger.debug(`Deleting set with id: ${id}`);
    const set = await this.setsRepository.softDelete({ id });

    if (set.affected === 0) {
      throw new NotFoundException(`Set with id: '${id}' not found`);
    }
  }

  async findSetsByMatchId(matchId: string): Promise<Set[]> {
    this.logger.debug(`Retrieving set with matchId: ${matchId}`);
    const found = await this.setsRepository.find({
      where: { match: { id: matchId } },
    });

    if (!found) {
      throw new NotFoundException(`Set with matchId: '${matchId}' not found`);
    }

    found.sort((a, b) => a.setNumber - b.setNumber);

    return found;
  }
}
