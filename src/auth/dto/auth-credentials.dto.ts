import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'The email address',
  })
  @IsString()
  @IsEmail({}, { message: 'Invalid e-mail' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'The password which must have 8 or more characters, at least one uppercase, one lowercase and one digit',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
