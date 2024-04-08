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
    const { email, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ email, password: hashedPassword });
    try {
      await this.save(user);
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
}
