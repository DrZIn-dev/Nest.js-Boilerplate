import { TodoEntity } from '@/model/todo.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreatePlaygroundDto extends PickType(TodoEntity, [
  'name',
  'description',
] as const) {}
