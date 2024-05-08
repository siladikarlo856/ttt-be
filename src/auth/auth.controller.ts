import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'User sign up' })
  @ApiResponse({ status: 201, description: 'User successfully signed up' })
  signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User sign in' })
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('/refresh')
  @ApiOperation({ summary: 'Request a new access token using a refresh token' })
  async refresh(@GetUser() user: User) {
    return this.authService.refreshToken(user);
  }
}
