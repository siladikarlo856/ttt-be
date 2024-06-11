import { IsNotEmpty } from 'class-validator';
import { Match } from 'src/matches/entities/match.entity';

export class CreateSetEntityDto {
  @IsNotEmpty()
  setNumber: number;

  @IsNotEmpty()
  homePlayerPoints: number;

  @IsNotEmpty()
  awayPlayerPoints: number;

  @IsNotEmpty()
  match: Match;
}
