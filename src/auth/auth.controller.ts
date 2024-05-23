import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserProfile } from './dto/user-profile.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController', { timestamp: true });

  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'User sign up' })
  @ApiResponse({ status: 201, description: 'User successfully signed up' })
  @ApiBody({ type: SignUpDto })
  signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User sign in' })
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(
      `User trying to sign in: email= '${authCredentialsDto.email}' pass= '${authCredentialsDto.password}'`,
    );
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('/refresh')
  @ApiOperation({ summary: 'Request a new access token using a refresh token' })
  @ApiResponse({
    status: 201,
    description: 'Access token successfully refreshed',
  })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(@GetUser() user: User): Promise<{ accessToken: string }> {
    this.logger.log(`User trying to refresh token: ${user.id}`);
    return this.authService.refreshToken(user);
  }

  @UseGuards(AuthGuard())
  @Get('/me')
  @ApiOperation({ summary: 'Get user information' })
  @ApiResponse({
    status: 200,
    description: 'User information successfully retrieved',
    type: UserProfile,
  })
  async getMe(@GetUser() user: User): Promise<UserProfile> {
    this.logger.log(`User trying to get information: ${user?.email}`);
    return this.authService.getMe(user);
  }
}
