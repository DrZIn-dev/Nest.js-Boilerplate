import { JwtAuthGuard } from '@/jwt-auth.guard';
import { MemberEntity } from '@/model/member.entity';
import { User } from '@/user.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateTodoDto } from './todo.dto';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async create(
    @User() member: MemberEntity,
    @Body() dto: CreateTodoDto,
  ) {
    return await this.todoService.create(member.id, dto);
  }
}
