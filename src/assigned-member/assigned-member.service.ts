import { AssignedMemberEntity } from '@/model/assigned-member.entity';
import { TodoEntity } from '@/model/todo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssignMemberDto } from './assigned-member.dto';

@Injectable()
export class AssignMemberService {
  constructor(
    @InjectRepository(AssignedMemberEntity)
    private assignMemberRepository: Repository<AssignedMemberEntity>,
  ) {}

  public async getAll() {
    return await this.assignMemberRepository.find({ relations: ['todo'] });
  }

  public async createMany(
    todoId: TodoEntity['id'],
    members: CreateAssignMemberDto,
  ) {
    const insertResult = await Promise.all(
      members.members.map((memberId) => {
        const newAssignedMember = {
          todo: {
            id: todoId,
          },
          member: {
            id: memberId,
          },
        };
        return this.assignMemberRepository.save(newAssignedMember);
      }),
    );
    return insertResult.map((e) => e.id);
  }

  public async remove(
    todoId: TodoEntity['id'],
    members: CreateAssignMemberDto,
  ) {
    const insertResult = await Promise.all(
      members.members.map((memberId) => {
        return this.assignMemberRepository.delete({
          todo: { id: todoId },
          member: { id: memberId },
        });
      }),
    );
    return insertResult;
  }
}
