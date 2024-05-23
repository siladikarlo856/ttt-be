import { IsString, MaxLength, MinLength } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto extends AuthCredentialsDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  lastName: string;
}
