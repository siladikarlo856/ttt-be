import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('opponents')
export class Opponent extends BaseEntity {
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
