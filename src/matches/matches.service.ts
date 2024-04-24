import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchesRepository } from './matches.repository';
import { Match } from './entities/match.entity';
import { PlayersService } from 'src/players/players.service';
import { User } from 'src/auth/user.entity';
import { ResultsService } from 'src/results/results.service';
import { MatchDto } from './dto/match.dto';

@Injectable()
export class MatchesService {
  private logger = new Logger('MatchesService', { timestamp: true });

  constructor(
    @InjectRepository(MatchesRepository)
    private matchesRepository: MatchesRepository,
    private playersService: PlayersService,
    private resultsService: ResultsService,
  ) {}

  private mapMatchToMatchDto(match: Match): MatchDto {
    return {
      id: match.id,
      date: match.date.toISOString(),
      homePlayerFullName: `${match.homePlayer.firstName} ${match.homePlayer.lastName}`,
      awayPlayerFullName: `${match.awayPlayer.firstName} ${match.awayPlayer.lastName}`,
      homePlayerSetsWon: match.result.homePlayerSetsWon,
      awayPlayerSetsWon: match.result.awayPlayerSetsWon,
    };
  }

  async create(createMatchDto: CreateMatchDto, user: User): Promise<Match> {
    this.logger.debug(`Creating a new match on ${createMatchDto.date}`);
    const {
      date,
      homePlayerId,
      awayPlayerId,
      homePlayerSetsWon,
      awayPlayerSetsWon,
    } = createMatchDto;

    const homePlayer = await this.playersService.findOne(homePlayerId, user);
    const awayPlayer = await this.playersService.findOne(awayPlayerId, user);

    const match = await this.matchesRepository.createMatch(
      new Date(date),
      homePlayer,
      awayPlayer,
    );

    const winner =
      homePlayerSetsWon > awayPlayerSetsWon ? homePlayer : awayPlayer;

    await this.resultsService.create({
      match,
      homePlayerSetsWon,
      awayPlayerSetsWon,
      winner,
    });

    return match;
  }

  async findAll(): Promise<MatchDto[]> {
    const matches = await this.matchesRepository.find({
      relations: ['result', 'homePlayer', 'awayPlayer'],
    });

    return matches.map((match): MatchDto => this.mapMatchToMatchDto(match));
  }

  async findOneMatch(id: string): Promise<MatchDto> {
    const match = await this.findOne(id);

    return this.mapMatchToMatchDto(match);
  }

  async findOne(id: string): Promise<Match> {
    const found = await this.matchesRepository.findOne({
      where: { id },
      relations: ['result', 'homePlayer', 'awayPlayer'],
    });

    if (!found) {
      this.logger.debug(`Match with id: '${id}' not found`);
      throw new NotFoundException(`Match with id: '${id}' not found`);
    }

    this.logger.debug(`Match with id: '${id}' found ${JSON.stringify(found)}`);

    // map to MatchDto
    return found;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto): Promise<MatchDto> {
    const match = await this.findOne(id);

    Object.assign(match, updateMatchDto);

    await this.matchesRepository.save(match);

    return this.mapMatchToMatchDto(match);
  }

  async remove(id: string): Promise<void> {
    const result = await this.matchesRepository.softDelete({ id });

    if (result.affected === 0) {
      this.logger.debug(`Match with id: '${id}' not found`);
      throw new NotFoundException(`Match with id: '${id}' not found`);
    }
  }
}
