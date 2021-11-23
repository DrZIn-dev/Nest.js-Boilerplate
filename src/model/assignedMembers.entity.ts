import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MemberEntity } from './member.entity';
import { TodoEntity } from './todo.entity';

@Entity({ name: 'assigned_members' })
@Unique(['todo', 'member'])
export class AssignedMemberEntity extends BaseEntity {
  @ManyToOne(() => TodoEntity)
  @JoinColumn({ name: 'todo_id' })
  todo: TodoEntity;

  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;
}
