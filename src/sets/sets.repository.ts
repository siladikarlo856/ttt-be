import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Set } from './entities/set.entity';
import { CreateSetEntityDto } from './dto/create-set-entity.dto';

@Injectable()
export class SetsRepository extends Repository<Set> {
  constructor(private dataSource: DataSource) {
    super(Set, dataSource.createEntityManager());
  }

  async createSet(createSetDto: CreateSetEntityDto): Promise<Set> {
    const { setNumber, homePlayerPoints, awayPlayerPoints, match } =
      createSetDto;
    const set = this.create({
      setNumber,
      homePlayerPoints,
      awayPlayerPoints,
      match,
    });

    await this.save(set);

    return set;
  }
}
