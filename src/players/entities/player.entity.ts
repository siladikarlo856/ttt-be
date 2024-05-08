import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('players')
export class Player extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.players, { eager: false })
  @Exclude({ toPlainOnly: true })
  createdBy: User;

  @OneToOne(() => User, (user) => user.player, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @Expose()
  get userId(): string {
    return this.user?.id ?? null;
  }
}
