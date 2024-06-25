import { StreakType } from 'src/types';

export class StatisticsDto {
  wins: number;
  losses: number;
  winRatio: number;
  currentStreak: {
    type: StreakType;
    length: number;
    startDate: string;
  };
}
