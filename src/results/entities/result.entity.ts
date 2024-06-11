import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('results')
export class Result extends BaseEntity {
  @Column()
  homePlayerSetsWon: number;

  @Column()
  awayPlayerSetsWon: number;

  @OneToOne(() => Player, (player) => player.id, { eager: false })
  @Exclude({ toPlainOnly: true })
  @JoinColumn()
  winner: Player;

  @Expose()
  get winnerId(): string {
    return this.winner?.id ?? null;
  }

  @OneToOne(() => Match, (match) => match.id, { eager: false })
  @JoinColumn()
  match: Match;
}
