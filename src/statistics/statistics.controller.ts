import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { SelectOption, SelectOptionModel } from 'src/types';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('statistics')
@Controller('statistics')
@UseGuards(AuthGuard())
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({ summary: 'Get years of played matches' })
  @ApiResponse({
    status: 200,
    description: 'Return years of played matches',
    type: SelectOptionModel,
    isArray: true,
  })
  @Get('years')
  getYears(@GetUser() user: User): Promise<SelectOption[]> {
    return this.statisticsService.getYears(user);
  }
}
