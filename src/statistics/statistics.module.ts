import { Module, forwardRef } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { MatchesModule } from 'src/matches/matches.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MatchesModule, forwardRef(() => AuthModule)],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
