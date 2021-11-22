import { TodoEntity } from '@/model/todo.entity';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePlaygroundDto } from './playground.dto';
import { PlaygroundService } from './playground.service';

@Controller('playground')
export class PlaygroundController {
  constructor(private playgroundService: PlaygroundService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(ClassSerializerInterceptor)
  public async create(@Body() dto: CreatePlaygroundDto) {
    return await this.playgroundService
      .create(dto)
      .then((res) => new TodoEntity(res));
  }
}
