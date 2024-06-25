import { Module, forwardRef } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchesRepository } from './matches.repository';
import { PlayersModule } from 'src/players/players.module';
import { AuthModule } from 'src/auth/auth.module';
import { ResultsModule } from 'src/results/results.module';
import { SetsModule } from 'src/sets/sets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    PlayersModule,
    ResultsModule,
    SetsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [MatchesController],
  providers: [MatchesService, MatchesRepository],
  exports: [MatchesService],
})
export class MatchesModule {}
