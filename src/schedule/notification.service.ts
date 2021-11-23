import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  @Cron('45 * * * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
