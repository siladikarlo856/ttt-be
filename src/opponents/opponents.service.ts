import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OpponentsRepository } from './opponents.repository';
import { Opponent } from './opponent.entity';
import { CreateOpponentDto } from './dto/create-opponent-dto';

@Injectable()
export class OpponentsService {
  constructor(
    @InjectRepository(OpponentsRepository)
    private opponentsRepository: OpponentsRepository,
  ) {}

  async getOpponents(): Promise<Opponent[]> {
    return this.opponentsRepository.find();
  }

  async getOpponentById(id: string): Promise<Opponent> {
    const found = await this.opponentsRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Opponent with id: '${id}' not found`);
    }

    return found;
  }

  async createOpponent(
    createOpponentDto: CreateOpponentDto,
  ): Promise<Opponent> {
    const { firstName, lastName } = createOpponentDto;

    const opponent = this.opponentsRepository.create({
      firstName,
      lastName,
    });

    await this.opponentsRepository.save(opponent);

    return opponent;
  }

  async deleteOpponent(id: string): Promise<void> {
    const result = await this.opponentsRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Opponent with id: '${id}' not found`);
    }
  }
}
