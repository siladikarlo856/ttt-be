import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersRepository } from './players.repository';
import { User } from 'src/auth/user.entity';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(PlayersRepository)
    private playersRepository: PlayersRepository,
  ) {}

  async create(createPlayerDto: CreatePlayerDto, user: User): Promise<Player> {
    return this.playersRepository.createPlayer(createPlayerDto, user);
  }

  async findAll(user: User): Promise<Player[]> {
    return this.playersRepository.find({ where: { user } });
  }

  async findOne(id: string, user: User): Promise<Player> {
    const found = await this.playersRepository.findOne({
      where: { id, user },
    });

    if (!found) {
      throw new NotFoundException(`Opponent with id: '${id}' not found`);
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
    const result = await this.playersRepository.softDelete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Opponent with id: '${id}' not found`);
    }
  }
}
