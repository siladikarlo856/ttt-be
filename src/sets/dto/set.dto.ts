import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SetDto {
  @ApiProperty({ example: '1', description: 'The id of the set' })
  id: string;
  @ApiProperty({
    example: 11,
    description: 'The number of points scored by the home player',
  })
  @IsInt()
  @Min(0)
  homePlayerPoints: number;

  @ApiProperty({
    example: 8,
    description: 'The number of points scored by the away player',
  })
  @IsInt()
  @Min(0)
  awayPlayerPoints: number;
}
