import { Opponent } from 'src/opponents/opponent.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Opponent, (opponent) => opponent.user, { eager: true })
  opponents: Opponent[];
}
