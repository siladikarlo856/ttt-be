import { ApiProperty } from '@nestjs/swagger';

export type StreakType = 'win' | 'loss';

export interface SelectOption<T = any> {
  value: T;
  label: string;
}

export class SelectOptionModel<T = any> {
  @ApiProperty({
    description: 'The value of the option',
  })
  value: T;
  @ApiProperty({
    description: 'The label of the option',
  })
  label: string;
}

export enum MatchType {
  FRIENDLY = 'friendly',
  TOURNAMENT = 'tournament',
  LEAGUE = 'league',
}
