import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MatchDto } from './dto/match.dto';

@ApiTags('matches')
@Controller('matches')
@UseGuards(AuthGuard())
export class MatchesController {
  private logger = new Logger('MatchesController', { timestamp: true });

  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Create a new match' })
  @ApiResponse({ status: 201, description: 'Match successfully created' })
  @ApiBody({ type: CreateMatchDto })
  @Post()
  create(@Body() createMatchDto: CreateMatchDto, @GetUser() user: User) {
    return this.matchesService.create(createMatchDto, user);
  }

  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({
    status: 200,
    description: 'Return all matches',
    type: MatchDto,
    isArray: true,
  })
  @Get()
  findAll(@GetUser() user: User): Promise<MatchDto[]> {
    return this.matchesService.findAll(user);
  }

  @ApiOperation({ summary: 'Get a match by id' })
  @ApiParam({ name: 'id', example: '1', description: 'The id of the match' })
  @ApiResponse({
    status: 200,
    description: 'Return the match with the given id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.matchesService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update a match' })
  @ApiParam({ name: 'id', example: '1', description: 'The id of the match' })
  @ApiBody({ type: UpdateMatchDto })
  @ApiResponse({ status: 200, description: 'Match successfully updated' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
    @GetUser() user: User,
  ) {
    return this.matchesService.update(id, updateMatchDto, user);
  }

  @ApiOperation({ summary: 'Delete a match' })
  @ApiParam({ name: 'id', example: '1', description: 'The id of the match' })
  @ApiResponse({ status: 204, description: 'Match successfully deleted' })
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.matchesService.remove(id, user);
  }
}
