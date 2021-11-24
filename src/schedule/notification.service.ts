import { TodoEntity, TODO_STATUS } from '@/model/todo.entity';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}
  private readonly logger = new Logger(NotificationService.name);

  @Cron('45 * * * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 45');
    return this.todoRepository
      .find({
        where: {
          status: TODO_STATUS.IN_PROGRESS,
          due_date: LessThanOrEqual(new Date()),
        },
        relations: ['assigned_members', 'assigned_members.member'],
      })
      .then((todos) => {
        console.log(todos);
      });
  }
}
