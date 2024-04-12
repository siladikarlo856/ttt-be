import { Opponent } from 'src/opponents/opponent.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Player } from 'src/players/entities/player.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Opponent, (opponent) => opponent.user, { eager: false })
  opponents: Opponent[];

  @OneToMany(() => Player, (player) => player.createdBy, { eager: false })
  players: Player[];

  @OneToOne(() => Player, (player) => player.user, { eager: false })
  @JoinColumn()
  player: Player;
}
