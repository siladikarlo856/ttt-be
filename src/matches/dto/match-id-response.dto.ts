import { ApiProperty } from '@nestjs/swagger';

export class MatchIdResponse {
  @ApiProperty({ description: 'The id of the created match' })
  id: string;
}
