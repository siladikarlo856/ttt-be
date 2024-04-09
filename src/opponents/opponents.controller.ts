import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OpponentsService } from './opponents.service';
import { Opponent } from './opponent.entity';
import { CreateOpponentDto } from './dto/create-opponent-dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('opponents')
@UseGuards(AuthGuard())
export class OpponentsController {
  constructor(private opponentsService: OpponentsService) {}

  @Get()
  getOpponents(@GetUser() user: User): Promise<Opponent[]> {
    console.log('getOpponents', user);
    return this.opponentsService.getOpponents(user);
  }

  @Get('/:id')
  getOpponentById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Opponent> {
    return this.opponentsService.getOpponentById(id, user);
  }

  @Post()
  createOpponent(
    @Body() createOpponentDto: CreateOpponentDto,
    @GetUser() user: User,
  ): Promise<Opponent> {
    return this.opponentsService.createOpponent(createOpponentDto, user);
  }

  @Delete('/:id')
  deleteOpponent(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.opponentsService.deleteOpponent(id, user);
  }
}
