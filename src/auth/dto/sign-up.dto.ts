import { IsString, MaxLength, MinLength } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class SignUpDto extends AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(32)
  lastName: string;
}
