import { TodoEntity, TODO_STATUS } from '@/model/todo.entity';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class NotificationSchedule {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  private readonly logger = new Logger(NotificationSchedule.name);

  @Cron('3 * * * * *')
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
        todos.forEach((todo) => {
          todo.assigned_members.forEach((member) => {
            this.notificationQueue.add({
              ...todo,
              assigned_members: member,
            });
          });
        });
      });
  }
}
