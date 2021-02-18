import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// import { Attachment } from './attachment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "simple-json" })
  data: any;
}
