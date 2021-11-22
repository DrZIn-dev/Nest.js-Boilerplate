import { TodoEntity } from '@/model/todo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaygroundDto } from './playground.dto';

@Injectable()
export class PlaygroundService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
  ) {}
  public async create(dto: CreatePlaygroundDto) {
    const insertResult = await this.todoRepo.save(dto);
    return insertResult;
  }
}
