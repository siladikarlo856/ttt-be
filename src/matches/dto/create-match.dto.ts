import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateSetDto } from 'src/sets/dto/create-set.dto';

export class CreateMatchDto {
  @ApiProperty({ example: '2021-09-01', description: 'The date of the match' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: '1', description: 'The id of the home player' })
  @IsNotEmpty()
  @IsUUID()
  homePlayerId: string;

  @ApiProperty({ example: '2', description: 'The id of the away player' })
  @IsNotEmpty()
  @IsUUID()
  awayPlayerId: string;

  @ApiProperty({
    example: '3',
    description: 'The number of sets won by the home player',
  })
  @IsInt()
  @Min(0)
  homePlayerSetsWon: number;

  @ApiProperty({
    example: '2',
    description: 'The number of sets won by the away player',
  })
  @IsInt()
  @Min(0)
  awayPlayerSetsWon: number;

  @ApiProperty({
    type: CreateSetDto,
    isArray: true,
    description: 'The sets played in the match',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateSetDto)
  sets?: CreateSetDto[];
}
