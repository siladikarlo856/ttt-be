import { DataSource, Repository } from 'typeorm';
import { Opponent } from './opponent.entity';
import { Injectable, Logger } from '@nestjs/common';
import { CreateOpponentDto } from './dto/create-opponent-dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class OpponentsRepository extends Repository<Opponent> {
  private logger = new Logger('OpponentsRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Opponent, dataSource.createEntityManager());
  }

  async createOpponent(
    createOpponentDto: CreateOpponentDto,
    user: User,
  ): Promise<Opponent> {
    const { firstName, lastName } = createOpponentDto;

    const opponent = this.create({
      firstName,
      lastName,
      user,
    });

    await this.save(opponent);

    return opponent;
  }
}
