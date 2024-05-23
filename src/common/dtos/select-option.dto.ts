import { ApiProperty } from '@nestjs/swagger';
import { SelectOption } from 'src/types';

export class SelectOptionDto implements SelectOption {
  @ApiProperty({ example: '1', description: 'The value of the option' })
  value: string;

  @ApiProperty({ example: 'Option 1', description: 'The label of the option' })
  label: string;
}
