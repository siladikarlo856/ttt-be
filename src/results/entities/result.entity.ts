import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('results')
export class Result extends BaseEntity {
  @Column()
  homePlayerSetsWon: number;

  @Column()
  awayPlayerSetsWon: number;

  @OneToOne(() => User, (user) => user.id, { eager: false })
  @Exclude({ toPlainOnly: true })
  winner: User;

  @Expose()
  get winnerId(): string {
    return this.winner?.id ?? null;
  }

  @OneToOne(() => Match, (match) => match.id, { eager: false })
  @JoinColumn()
  match: Match;
}
