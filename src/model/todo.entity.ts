import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'todo' })
export class TodoEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: false })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  description: string;

  @Column({ type: 'timestamptz', nullable: false })
  @IsDate()
  dueDate: Date;

  constructor(partial: Partial<TodoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
