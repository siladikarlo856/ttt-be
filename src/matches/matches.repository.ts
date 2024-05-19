import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { Player } from 'src/players/entities/player.entity';
import { User } from 'src/auth/user.entity';

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
}
