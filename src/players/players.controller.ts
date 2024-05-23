import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { SelectOption } from 'src/types';
import { SelectOptionDto } from 'src/common/dtos/select-option.dto';
import { Player } from './entities/player.entity';

@ApiTags('players')
@Controller('players')
@UseGuards(AuthGuard())
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @ApiOperation({ summary: 'Create a new player' })
  @ApiBody({ type: CreatePlayerDto })
  @ApiResponse({ status: 201, description: 'Player successfully created' })
  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto, @GetUser() user: User) {
    return this.playersService.create(createPlayerDto, user);
  }

  @ApiOperation({ summary: 'Get all players' })
  @ApiResponse({
    status: 200,
    description: 'Return all players',
    type: SelectOptionDto,
    isArray: true,
  })
  @Get()
  findAll(@GetUser() user: User): Promise<SelectOption[]> {
    return this.playersService.findAll(user);
  }

  @ApiOperation({ summary: 'Get a player by id' })
  @ApiParam({ name: 'id', example: '1', description: 'The id of the player' })
  @ApiResponse({ type: Player })
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User): Promise<Player> {
    return this.playersService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update a player' })
  @ApiBody({ type: UpdatePlayerDto })
  @ApiResponse({ type: Player })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
    @GetUser() user: User,
  ) {
    return this.playersService.update(id, updatePlayerDto, user);
  }

  @ApiOperation({ summary: 'Delete a player' })
  @ApiParam({ name: 'id', example: '1', description: 'The id of the player' })
  @ApiResponse({ status: 204, description: 'Player successfully deleted' })
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.playersService.remove(id, user);
  }
}
