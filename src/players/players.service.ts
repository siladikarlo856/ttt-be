import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersRepository } from './players.repository';
import { User } from 'src/auth/user.entity';
import { Player } from './entities/player.entity';
import { SelectOption } from 'src/types';

@Injectable()
export class PlayersService {
  private logger = new Logger('PlayersService', { timestamp: true });

  constructor(
    @InjectRepository(PlayersRepository)
    private playersRepository: PlayersRepository,
  ) {}

  async create(createPlayerDto: CreatePlayerDto, user: User): Promise<Player> {
    return this.playersRepository.createPlayer(createPlayerDto, user);
  }

  async findAll(user: User): Promise<SelectOption[]> {
    this.logger.verbose(
      `Retrieving all players for user: ${JSON.stringify(user)}`,
    );
    const players = await this.playersRepository
      .createQueryBuilder('player')
      .where('player.createdBy = :userId', { userId: user.id })
      .getMany();

    return players.map((player) => ({
      value: player.id,
      label: `${player.firstName} ${player.lastName}`,
    }));
  }

  async findOne(id: string, user: User): Promise<Player> {
    const found = await this.playersRepository
      .createQueryBuilder('player')
      .where('player.id = :id', { id })
      .where('player.createdBy = :userId', { userId: user.id })
      .getOne();

    if (!found) {
      throw new NotFoundException(`Player with id: '${id}' not found`);
    }

    return found;
  }

  async update(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
    user: User,
  ): Promise<Player> {
    const player = await this.findOne(id, user);

    Object.assign(player, updatePlayerDto);

    await this.playersRepository.save(player);

    return player;
  }

  async remove(id: string, user: User): Promise<void> {
    const result = await this.playersRepository.softDelete({
      id,
      createdBy: user,
    });

    if (result.affected === 0) {
      this.logger.debug(`Player with id: '${id}' not found`);
      throw new NotFoundException(`Player with id: '${id}' not found`);
    }
  }
}
