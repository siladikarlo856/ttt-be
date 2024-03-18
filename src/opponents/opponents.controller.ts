import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OpponentsService } from './opponents.service';
import { Opponent } from './opponent.entity';
import { CreateOpponentDto } from './dto/create-opponent-dto';
@Controller('opponents')
export class OpponentsController {
  constructor(private opponentsService: OpponentsService) {}

  @Get()
  getOpponents(): Promise<Opponent[]> {
    return this.opponentsService.getOpponents();
  }

  @Get('/:id')
  getOpponentById(@Param('id') id: string): Promise<Opponent> {
    console.log('id', id);
    return this.opponentsService.getOpponentById(id);
  }

  @Post()
  createOpponent(
    @Body() createOpponentDto: CreateOpponentDto,
  ): Promise<Opponent> {
    return this.opponentsService.createOpponent(createOpponentDto);
  }

  @Delete('/:id')
  deleteOpponent(@Param('id') id: string): Promise<void> {
    return this.opponentsService.deleteOpponent(id);
  }
}
