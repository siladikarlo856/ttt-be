import { Opponent } from 'src/opponents/opponent.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Opponent, (opponent) => opponent.user, { eager: true })
  opponents: Opponent[];
}
