import { ApiProperty } from '@nestjs/swagger';
import { SetDto } from 'src/sets/dto/set.dto';
export class MatchDto {
  @ApiProperty({ example: '1', description: 'The id of the match' })
  id: string;
  @ApiProperty({ example: '2021-09-01', description: 'The date of the match' })
  date: string;

  @ApiProperty({
    example: { id: '1', label: 'John Doe' },
    description: 'The home player id and full name',
  })
  homePlayer: {
    id: string;
    label: string;
  };

  @ApiProperty({
    example: { id: '2', label: 'Jane Doe' },
    description: 'The away player id and full name',
  })
  awayPlayer: {
    id: string;
    label: string;
  };

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

  @ApiProperty({
    type: SetDto,
    isArray: true,
    description: 'The sets played in the match',
  })
  sets: SetDto[];
}
