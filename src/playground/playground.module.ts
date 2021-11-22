import { TodoEntity } from '@/model/todo.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaygroundController } from './playground.controller';
import { PlaygroundService } from './playground.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [PlaygroundController],
  providers: [PlaygroundService],
})
export class PlaygroundModule {}
