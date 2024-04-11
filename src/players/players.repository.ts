import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class PlayersRepository extends Repository<Player> {
  private logger = new Logger('PlayersRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Player, dataSource.createEntityManager());
  }

  async createPlayer(
    createPlayerDto: CreatePlayerDto,
    user: User,
  ): Promise<Player> {
    const { firstName, lastName } = createPlayerDto;

    const player = this.create({
      firstName,
      lastName,
      user,
    });

    await this.save(player);

    return player;
  }
}
