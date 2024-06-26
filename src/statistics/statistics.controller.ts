import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { SelectOption, SelectOptionModel } from 'src/types';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsDto } from './dto/statistics.dto';
import { GetStatisticsParams } from './dto/get-statistics.dto';

@ApiTags('statistics')
@Controller('statistics')
@UseGuards(AuthGuard())
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post()
  getStatistics(
    @Body() getStatisticsParams: GetStatisticsParams,
    @GetUser() user: User,
  ): Promise<StatisticsDto> {
    return this.statisticsService.getStatistics(getStatisticsParams, user);
  }

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
