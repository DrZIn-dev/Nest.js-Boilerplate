import { MemberService } from '@/member/member.service';
import { MemberEntity } from '@/model/member.entity';
import { TodoEntity } from '@/model/todo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    private memberService: MemberService,
  ) {}

  public async create(
    memberId: MemberEntity['id'],
    dto: CreateTodoDto,
  ): Promise<TodoEntity['id']> {
    const member = await this.memberService.findById(memberId);
    const newTodo: Partial<TodoEntity> = {
      ...dto,
      member,
    };

    const insertResult = await this.todoRepository.save(newTodo);
    return insertResult.id;
  }
}
