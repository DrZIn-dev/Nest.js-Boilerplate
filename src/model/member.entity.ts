import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'member' })
export class Member extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 300, unique: true, nullable: false })
  username: string;

  @Column({ type: 'text', nullable: false })
  password: string;
}
