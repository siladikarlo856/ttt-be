import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { PlayersRepository } from './players.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), AuthModule], // 👈 Add AuthModule to the imports array
  controllers: [PlayersController],
  providers: [PlayersService, PlayersRepository],
})
export class PlayersModule {}
