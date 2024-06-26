import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { PlayersService } from 'src/players/players.service';
import { UserProfile } from './dto/user-profile.dto';

enum UserErrors {
  DUPLICATE_USERNAME = '23505',
}

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService', { timestamp: true });

  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private playersService: PlayersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { email, password, firstName, lastName } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const player = await this.playersService.create(
      { firstName, lastName },
      null,
    );

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      player,
    });

    try {
      const createdUser = await this.usersRepository.save(user);
      player.createdBy = createdUser;
      await this.playersService.update(player.id, player, null);
      this.logger.debug(`User '${email}' successfully created`);
    } catch (error) {
      if (error.code === UserErrors.DUPLICATE_USERNAME) {
        this.logger.error(
          `The e-mail:'${email}' has been used to register before`,
        );
        throw new ConflictException('E-mail already used');
      } else {
        this.logger.error(`Failed to create user '${email}'`, error.stack);
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.debug(
      `User is trying to sign in with these credentials: ${JSON.stringify(authCredentialsDto)}`,
    );
    const { email, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async refreshToken(user: User): Promise<{ accessToken: string }> {
    const userFromDb = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    const payload: JwtPayload = {
      email: userFromDb.email,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async getMe(user: User): Promise<UserProfile> {
    const userFromDb = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['player'],
    });

    return {
      playerId: userFromDb.player.id,
      email: userFromDb.email,
      firstName: userFromDb.player.firstName,
      lastName: userFromDb.player.lastName,
    };
  }
}
