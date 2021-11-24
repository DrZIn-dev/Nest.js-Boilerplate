import { AssignMemberService } from '@/assigned-member/assigned-member.service';
import { MemberService } from '@/member/member.service';
import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [],
  controllers: [TodoController],
  providers: [TodoService, MemberService, AssignMemberService],
})
export class TodoModule {}
