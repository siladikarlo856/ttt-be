import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { CreateMatchDto } from './create-match.dto';
import { SetDto } from 'src/sets/dto/set.dto';

export class UpdateMatchDto extends PartialType(
  OmitType(CreateMatchDto, ['sets']),
) {
  @ApiProperty({
    type: SetDto,
    isArray: true,
    description: 'The sets played in the match',
  })
  sets: SetDto[];
}
