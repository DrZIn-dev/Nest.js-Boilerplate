import { TodoEntity } from '@/model/todo.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateTodoDto extends PickType(TodoEntity, [
  'title',
  'description',
  'due_date',
] as const) {}
