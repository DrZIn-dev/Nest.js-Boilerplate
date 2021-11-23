import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { configService } from './config/config.service';
import { GlobalModule } from './global.module';
import { MemberModule } from './member/member.module';
import { NotificationService } from './schedule/notification.service';
import { TodoModule } from './todo/todo.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ScheduleModule.forRoot(),
    MemberModule,
    AuthModule,
    GlobalModule,
    TodoModule,
  ],
  controllers: [],
  providers: [NotificationService],
})
export class AppModule {}
