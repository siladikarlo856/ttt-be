import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Player } from 'src/players/entities/player.entity';
import { Result } from 'src/results/entities/result.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
} from 'typeorm';

@Entity('matches')
export class Match extends BaseEntity {
  @Column()
  date: Date;

  @ManyToOne(() => Player, (player) => player.id, { eager: false })
  @Exclude({ toPlainOnly: true })
  homePlayer: Player;

  @RelationId((match: Match) => match.homePlayer ?? null)
  homePlayerId: string;

  @ManyToOne(() => Player, (player) => player.id, { eager: false })
  @Exclude({ toPlainOnly: true })
  awayPlayer: Player;

  @RelationId((match: Match) => match.awayPlayer ?? null)
  awayPlayerId: string;

  @OneToOne(() => Result, (result) => result.match, { eager: false })
  result: Result;
}
