import { IsNotEmpty } from 'class-validator';
import { User } from 'src/auth/user.entity';

export class CreateResultDto {
  @IsNotEmpty()
  homePlayerSetsWon: number;

  @IsNotEmpty()
  awayPlayerSetsWon: number;

  @IsNotEmpty()
  winner: User;
}
