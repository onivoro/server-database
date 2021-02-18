import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  uri!: string;

  user!: User;
}
