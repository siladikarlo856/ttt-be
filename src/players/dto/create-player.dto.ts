import { IsNotEmpty } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
