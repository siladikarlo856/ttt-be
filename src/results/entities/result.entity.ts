import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';

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

  //TODO: add match relation
}
