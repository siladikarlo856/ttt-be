import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OpponentsRepository } from './opponents.repository';
import { Opponent } from './opponent.entity';
import { CreateOpponentDto } from './dto/create-opponent-dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class OpponentsService {
  constructor(
    @InjectRepository(OpponentsRepository)
    private opponentsRepository: OpponentsRepository,
  ) {}

  async getOpponents(user: User): Promise<Opponent[]> {
    return this.opponentsRepository.find({ where: { user } });
  }

  async getOpponentById(id: string, user: User): Promise<Opponent> {
    const found = await this.opponentsRepository.findOne({
      where: { id, user },
    });

    if (!found) {
      throw new NotFoundException(`Opponent with id: '${id}' not found`);
    }

    return found;
  }

  async createOpponent(
    createOpponentDto: CreateOpponentDto,
    user: User,
  ): Promise<Opponent> {
    return this.opponentsRepository.createOpponent(createOpponentDto, user);
  }

  async deleteOpponent(id: string, user: User): Promise<void> {
    const result = await this.opponentsRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Opponent with id: '${id}' not found`);
    }
  }
}
