import { ApiProperty } from '@nestjs/swagger';

export class UserProfile {
  @ApiProperty({ example: 'uuid', description: "The user's player id" })
  playerId: string;

  @ApiProperty({ example: 'mail@example.com', description: "The user's email" })
  email: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;
}
