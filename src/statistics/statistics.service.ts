import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { MatchesService } from 'src/matches/matches.service';
import { SelectOption, StreakType } from 'src/types';
import { StatisticsDto } from './dto/statistics.dto';
import { GetStatisticsParams } from './dto/get-statistics.dto';
import { Match } from 'src/matches/entities/match.entity';

@Injectable()
export class StatisticsService {
  private logger = new Logger('StatisticsService', { timestamp: true });

  constructor(private readonly matchesService: MatchesService) {}

  async getStatistics(
    getStatisticsParams: GetStatisticsParams,
    user: User,
  ): Promise<StatisticsDto> {
    this.logger.verbose(
      `User ${user.id} is getting statistics with parameters: ${JSON.stringify(
        getStatisticsParams,
      )}`,
    );

    const { startDate } = getStatisticsParams;

    const startDateDate = new Date(startDate);

    const matches = await this.matchesService.getAllMatchesAfterDate(
      startDateDate,
      user,
    );

    if (matches.length === 0) {
      return {
        wins: 0,
        losses: 0,
        winRatio: 0,
        currentStreak: {
          type: 'loss',
          length: 0,
          startDate: new Date().toISOString(),
        },
      };
    }

    const wins = matches.filter((match) => {
      return match.result.winner.id === user.player.id;
    }).length;
    const losses = matches.length - wins;
    const winRatio = matches.length ? wins / matches.length : 0;

    let streakCount = 1;
    const streakType = getMatchStreakType(matches[0], user);
    let streakStartDate = matches[0].date;

    function getMatchStreakType(match: Match, user: User): StreakType {
      return match.result.winner.id === user.player.id ? 'win' : 'loss';
    }

    let i = 1;
    while (
      i < matches.length &&
      getMatchStreakType(matches[i], user) === streakType
    ) {
      streakCount++;
      streakStartDate = matches[i].date;
      i++;
    }

    return {
      wins,
      losses,
      winRatio,
      currentStreak: {
        type: streakType as StreakType,
        length: streakCount,
        startDate: streakStartDate.toISOString(),
      },
    };
  }

  async getYears(user: User): Promise<SelectOption<number>[]> {
    const distinctYears = await this.matchesService.getDistinctYears(user);

    return distinctYears.map((year) => ({
      label: year.toString(),
      value: year,
    }));
  }
}
