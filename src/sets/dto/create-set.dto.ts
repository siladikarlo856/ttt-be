import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSetDto {
  @ApiProperty({
    example: 1,
    description: 'The home player points',
  })
  @IsNotEmpty()
  homePlayerPoints: number;

  @ApiProperty({
    example: 1,
    description: 'The away player points',
  })
  @IsNotEmpty()
  awayPlayerPoints: number;
}
