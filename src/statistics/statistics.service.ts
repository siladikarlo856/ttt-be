import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { MatchesService } from 'src/matches/matches.service';
import { SelectOption } from 'src/types';

@Injectable()
export class StatisticsService {
  constructor(private readonly matchesService: MatchesService) {}

  async getYears(user: User): Promise<SelectOption<number>[]> {
    const distinctYears = await this.matchesService.getDistinctYears(user);

    return distinctYears.map((year) => ({
      label: year.toString(),
      value: year,
    }));
  }
}
