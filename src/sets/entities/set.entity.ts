import { BaseEntity } from 'src/common/entities/base.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('sets')
export class Set extends BaseEntity {
  @Column()
  setNumber: number;

  @Column()
  homePlayerPoints: number;

  @Column()
  awayPlayerPoints: number;

  @ManyToOne(() => Match, (match) => match.sets, { eager: false })
  match: Match;
}
