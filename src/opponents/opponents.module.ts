import { Module } from '@nestjs/common';
import { OpponentsService } from './opponents.service';
import { OpponentsRepository } from './opponents.repository';
import { Opponent } from './opponent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpponentsController } from './opponents.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Opponent]), AuthModule],
  controllers: [OpponentsController],
  providers: [OpponentsService, OpponentsRepository],
})
export class OpponentsModule {}
