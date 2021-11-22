import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MemberEntity } from './member.entity';

export enum TODO_STATUS {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETE,
}

@Entity({ name: 'todo' })
export class TodoEntity extends BaseEntity {
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @IsEnum(TODO_STATUS)
  @Column({ type: 'enum', enum: TODO_STATUS, default: TODO_STATUS.NOT_STARTED })
  status: TODO_STATUS;

  @Type(() => Date)
  @IsDate()
  @Column({ type: 'timestamptz', nullable: false })
  due_date: Date;
}
