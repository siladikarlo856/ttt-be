import { DataSource, Repository } from 'typeorm';
import { Opponent } from './opponent.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OpponentsRepository extends Repository<Opponent> {
  private logger = new Logger('OpponentsRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Opponent, dataSource.createEntityManager());
  }
}
