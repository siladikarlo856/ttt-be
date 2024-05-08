import { IsNotEmpty } from 'class-validator';
import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';

export class CreateResultDto {
  @IsNotEmpty()
  homePlayerSetsWon: number;

  @IsNotEmpty()
  awayPlayerSetsWon: number;

  @IsNotEmpty()
  winner: Player;

  @IsNotEmpty()
  match: Match;
}
