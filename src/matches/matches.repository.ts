import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { Player } from 'src/players/entities/player.entity';
import { User } from 'src/auth/user.entity';
import { GetMatchesFilterDto } from './dto/get-matches-filter.dto';

@Injectable()
export class MatchesRepository extends Repository<Match> {
  private logger = new Logger('MatchesRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Match, dataSource.createEntityManager());
  }

  async createMatch(
    date: Date,
    homePlayer: Player,
    awayPlayer: Player,
    user: User,
  ): Promise<Match> {
    this.logger.debug(
      `Creating a new match for ${homePlayer.firstName} vs ${awayPlayer.firstName} @ ${date}`,
    );

    const match = this.create({
      date,
      homePlayer,
      awayPlayer,
      createdBy: user,
    });

    await this.save(match);

    return match;
  }

  async getMatches(
    filterDto: GetMatchesFilterDto,
    user: User,
  ): Promise<Match[]> {
    const { year, opponents } = filterDto;

    const query = this.createQueryBuilder('match')
      .leftJoinAndSelect('match.result', 'result')
      .leftJoinAndSelect('result.winner', 'winner')
      .leftJoinAndSelect('match.homePlayer', 'homePlayer')
      .leftJoinAndSelect('match.awayPlayer', 'awayPlayer')
      .leftJoinAndSelect('match.sets', 'sets')
      .where('match.createdBy = :userId', { userId: user.id })
      .orderBy('match.date', 'DESC');

    if (year) {
      query.andWhere('EXTRACT(YEAR FROM match.date) = :year', { year });
    }

    if (opponents !== undefined) {
      const opponentsArr =
        typeof opponents === 'string' ? [opponents] : opponents;
      query.andWhere('match.awayPlayerId IN (:...opponentsArr)', {
        opponentsArr,
      });
    }

    return query.getMany();
  }

  async getMatchesByDate(startDate: Date, user: User): Promise<Match[]> {
    return this.createQueryBuilder('match')
      .leftJoinAndSelect('match.result', 'result')
      .leftJoinAndSelect('result.winner', 'winner')
      .where('match.createdBy = :userId', { userId: user.id })
      .andWhere('match.date >= :startDate', { startDate })
      .orderBy('match.date', 'DESC')
      .getMany();
  }
}
