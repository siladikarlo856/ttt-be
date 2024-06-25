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
import { SetsService } from 'src/sets/sets.service';
import { MatchIdResponse } from './dto/match-id-response.dto';
import { CreateSetDto } from 'src/sets/dto/create-set.dto';
import { GetMatchesFilterDto } from './dto/get-matches-filter.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class MatchesService {
  private logger = new Logger('MatchesService', { timestamp: true });

  constructor(
    @InjectRepository(MatchesRepository)
    private matchesRepository: MatchesRepository,
    private playersService: PlayersService,
    private resultsService: ResultsService,
    private setsService: SetsService,
    private dataSource: DataSource,
  ) {}

  private async findOne(id: string, user: User): Promise<Match> {
    const found = await this.matchesRepository.findOne({
      where: { id, createdBy: user },
      relations: ['result', 'homePlayer', 'awayPlayer', 'sets'],
    });

    if (!found) {
      this.logger.debug(`Match with id: '${id}' not found`);
      throw new NotFoundException(`Match with id: '${id}' not found`);
    }

    return found;
  }

  private mapMatchToMatchDto(match: Match): MatchDto {
    return {
      id: match.id,
      date: match.date.toISOString(),
      homePlayer: {
        id: match.homePlayer.id,
        label: `${match.homePlayer.firstName} ${match.homePlayer.lastName}`,
      },
      awayPlayer: {
        id: match.awayPlayer.id,
        label: `${match.awayPlayer.firstName} ${match.awayPlayer.lastName}`,
      },
      homePlayerSetsWon: match.result.homePlayerSetsWon,
      awayPlayerSetsWon: match.result.awayPlayerSetsWon,
      sets: match.sets.map((set) => ({
        id: set.id,
        homePlayerPoints: set.homePlayerPoints,
        awayPlayerPoints: set.awayPlayerPoints,
      })),
    };
  }

  /**
   * Creates a new match.
   */
  async create(
    createMatchDto: CreateMatchDto,
    user: User,
  ): Promise<MatchIdResponse> {
    this.logger.verbose(
      `Creating a new match played on ${createMatchDto.date}`,
    );
    const {
      date,
      homePlayerId,
      awayPlayerId,
      homePlayerSetsWon,
      awayPlayerSetsWon,
      sets,
    } = createMatchDto;

    const homePlayer = await this.playersService.findOne(homePlayerId, user);
    const awayPlayer = await this.playersService.findOne(awayPlayerId, user);

    const match = await this.matchesRepository.createMatch(
      new Date(date),
      homePlayer,
      awayPlayer,
      user,
    );

    const winner =
      homePlayerSetsWon > awayPlayerSetsWon ? homePlayer : awayPlayer;

    // create ans save result
    await this.resultsService.create({
      match,
      homePlayerSetsWon,
      awayPlayerSetsWon,
      winner,
    });

    // create and save sets
    if (Array.isArray(sets) && sets.length > 0) {
      sets.forEach(async (set: CreateSetDto, i: number) => {
        await this.setsService.create({
          awayPlayerPoints: set.awayPlayerPoints,
          homePlayerPoints: set.homePlayerPoints,
          match,
          setNumber: i,
        });
      });
    }

    return { id: match.id };
  }

  /**
   * Retrieves all matches created by a user sorted by date.
   *
   */
  async findAll(filter: GetMatchesFilterDto, user: User): Promise<MatchDto[]> {
    const matches = await this.matchesRepository.getMatches(filter, user);

    return matches.map((match): MatchDto => this.mapMatchToMatchDto(match));
  }

  /**
   * Finds and returns a single match created by a user by its ID.
   *
   */
  async findOneMatch(id: string, user: User): Promise<MatchDto> {
    const match = await this.findOne(id, user);

    this.logger.debug(
      `Match with id: '${id}' found, ${JSON.stringify(match.sets)}`,
    );

    return this.mapMatchToMatchDto(match);
  }

  /**
   * Updates a match with the provided data.
   *
   */
  async update(
    id: string,
    updateMatchDto: UpdateMatchDto,
    user: User,
  ): Promise<MatchDto> {
    const match = await this.findOne(id, user);
    const existingSets =
      (await this.setsService.findSetsByMatchId(match.id)) ?? [];

    Object.assign(match, {
      date: new Date(updateMatchDto.date),
      homePlayer:
        updateMatchDto.homePlayerId &&
        (await this.playersService.findOne(updateMatchDto.homePlayerId, user)),
      awayPlayer:
        updateMatchDto.awayPlayerId &&
        (await this.playersService.findOne(updateMatchDto.awayPlayerId, user)),
    });

    await this.matchesRepository.save(match);

    updateMatchDto.sets.forEach(async (set, index) => {
      const existingSet = existingSets.find((s) => s.id === set.id);
      if (existingSet) {
        this.setsService.update(set);
        existingSets.splice(existingSets.indexOf(existingSet), 1);
      } else {
        await this.setsService.create({
          awayPlayerPoints: set.awayPlayerPoints,
          homePlayerPoints: set.homePlayerPoints,
          match,
          setNumber: index,
        });
      }
    });

    existingSets.forEach(async (set) => {
      await this.setsService.remove(set.id);
    });

    const winner =
      updateMatchDto.homePlayerSetsWon > updateMatchDto.awayPlayerSetsWon
        ? match.homePlayer
        : match.awayPlayer;

    await this.resultsService.update(match.result.id, {
      awayPlayerSetsWon: updateMatchDto.awayPlayerSetsWon,
      homePlayerSetsWon: updateMatchDto.homePlayerSetsWon,
      winner,
    });

    const updatedMatch = await this.findOne(id, user);

    return this.mapMatchToMatchDto(updatedMatch);
  }

  /**
   * Deletes a match.
   *
   */
  async remove(id: string, user: User): Promise<void> {
    const result = await this.matchesRepository.softDelete({
      id,
      createdBy: user,
    });

    if (result.affected === 0) {
      this.logger.debug(`Match with id: '${id}' not found`);
      throw new NotFoundException(`Match with id: '${id}' not found`);
    }
  }

  async getDistinctYears(user: User): Promise<number[]> {
    const matches = await this.matchesRepository
      .createQueryBuilder('match')
      .where('match.createdBy = :userId', { userId: user.id })
      .getMany();

    function getDistinctYears(dates: Date[]): number[] {
      const years = dates.map((date) => date.getFullYear());
      const distinctYears = [...new Set(years)];
      return distinctYears;
    }

    const distinctYears = getDistinctYears(matches.map((m) => m.date)).sort(
      (a, b) => b - a,
    );

    return distinctYears;
  }

  async getAllMatchesAfterDate(startDate: Date, user: User): Promise<Match[]> {
    const matches = await this.matchesRepository.getMatchesByDate(
      startDate,
      user,
    );

    return matches;
  }
}
