import { MemberService } from '@/member/member.service';
import { MemberEntity } from '@/model/member.entity';
import { TodoEntity } from '@/model/todo.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';

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

  public async update(
    memberId: MemberEntity['id'],
    todoId: MemberEntity['id'],
    dto: UpdateTodoDto,
  ) {
    const isExists = await this.todoRepository.findOne({
      where: { id: todoId, member: { id: memberId } },
    });
    if (!isExists) throw new ForbiddenException();
    await this.todoRepository.update(todoId, dto);
    return Promise.resolve();
  }
}
