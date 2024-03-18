import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Opponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  note: string;
}
