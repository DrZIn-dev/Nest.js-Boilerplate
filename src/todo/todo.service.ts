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

  private async validateOwner(
    memberId: MemberEntity['id'],
    todoId: TodoEntity['id'],
  ): Promise<boolean> {
    const isExists = await this.todoRepository.findOne({
      where: { id: todoId, member: { id: memberId } },
    });
    if (isExists) return true;
    return false;
  }

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
  ): Promise<void> {
    const isOwner = await this.validateOwner(memberId, todoId);
    if (!isOwner) throw new ForbiddenException();
    await this.todoRepository.update(todoId, dto);
    return Promise.resolve();
  }

  public async delete(
    memberId: MemberEntity['id'],
    todoId: MemberEntity['id'],
  ): Promise<void> {
    const isOwner = await this.validateOwner(memberId, todoId);
    if (!isOwner) throw new ForbiddenException();
    await this.todoRepository.softDelete(todoId);
    return Promise.resolve();
  }

  public async getAll(): Promise<TodoEntity[]> {
    return await this.todoRepository.find({
      relations: ['member', 'assigned_members', 'assigned_members.member'],
    });
  }
}
