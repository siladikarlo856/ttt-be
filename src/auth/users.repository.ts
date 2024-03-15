import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

enum UserErrors {
  DUPLICATE_USERNAME = '23505',
}

@Injectable()
export class UsersRepository extends Repository<User> {
  private logger = new Logger('UsersRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === UserErrors.DUPLICATE_USERNAME) {
        this.logger.error(`Username '${username}' already exists`);
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(`Failed to create user '${username}'`, error.stack);
        throw new InternalServerErrorException();
      }
    }
  }
}
