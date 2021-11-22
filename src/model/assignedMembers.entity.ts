import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TodoEntity } from './todo.entity';

@Entity({ name: 'assigned_members' })
export class MemberEntity extends BaseEntity {
  @ManyToOne(() => TodoEntity)
  @JoinColumn({ name: 'todo_id' })
  todo: TodoEntity;

  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;
}
