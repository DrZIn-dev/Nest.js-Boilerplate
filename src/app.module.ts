import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignMemberModule } from './assigned-member/assigned-member.module';
import { AssignMemberService } from './assigned-member/assigned-member.service';
import { AuthModule } from './auth/auth.module';
import { configService } from './config/config.service';
import { NotificationConsumer } from './consumer/notification.consumer';
import { GlobalModule } from './global.module';
import { MemberModule } from './member/member.module';
import { NotificationSchedule } from './schedule/notification.schedule';
import { TodoModule } from './todo/todo.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ScheduleModule.forRoot(),
    MemberModule,
    AuthModule,
    GlobalModule,
    TodoModule,
    AssignMemberModule,
  ],
  controllers: [],
  providers: [NotificationSchedule, AssignMemberService, NotificationConsumer],
})
export class AppModule {}
