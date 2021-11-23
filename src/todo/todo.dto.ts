import { TodoEntity } from '@/model/todo.entity';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class CreateTodoDto extends PickType(TodoEntity, [
  'title',
  'description',
  'due_date',
] as const) {}

export class UpdateTodoDto extends PartialType(
  PickType(TodoEntity, ['title', 'description', 'status'] as const),
) {}
