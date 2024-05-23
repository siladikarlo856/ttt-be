import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({ example: '2021-09-01', description: 'The date of the match' })
  date: string;
  @ApiProperty({ example: '1', description: 'The id of the home player' })
  homePlayerId: string;
  @ApiProperty({ example: '2', description: 'The id of the away player' })
  awayPlayerId: string;
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
