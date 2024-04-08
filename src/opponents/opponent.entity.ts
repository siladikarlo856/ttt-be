import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('opponents')
export class Opponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.opponents, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
