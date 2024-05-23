import { ApiProperty } from '@nestjs/swagger';
export class MatchDto {
  @ApiProperty({ example: '1', description: 'The id of the match' })
  id: string;
  @ApiProperty({ example: '2021-09-01', description: 'The date of the match' })
  date: string;
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the home player',
  })
  homePlayerFullName: string;
  @ApiProperty({
    example: 'Jane Doe',
    description: 'The full name of the away player',
  })
  awayPlayerFullName: string;
  @ApiProperty({
    example: '3',
    description: 'The number of sets won by the home player',
  })
  homePlayerSetsWon: number;
  @ApiProperty({
    example: '2',
    description: 'The number of sets won by the away player',
  })
  awayPlayerSetsWon: number;
}
