import { IsNotEmpty } from 'class-validator';
import { RubberType } from '../rubber-type.enum';

export class CreateOpponentDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  bhRubber?: RubberType;

  fhRubber?: RubberType;
}
