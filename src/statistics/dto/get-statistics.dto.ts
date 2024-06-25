import { ApiProperty } from '@nestjs/swagger';

export class GetStatisticsParams {
  @ApiProperty({
    example: '2021-01-01',
    description: 'The start date to filter by',
    required: true,
  })
  startDate: string;

  @ApiProperty({
    example: '2021-12-31',
    description: 'The end date to filter by',
    required: true,
  })
  endDate?: string;

  @ApiProperty({
    example: ['uuid1', 'uuid2'],
    description: 'The opponents to filter by',
    required: false,
  })
  opponents?: string[];
}
