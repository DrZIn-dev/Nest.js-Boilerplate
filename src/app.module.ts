import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignMemberModule } from './assigned-member/assigned-member.module';
import { AssignMemberService } from './assigned-member/assigned-member.service';
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
    AssignMemberModule,
  ],
  controllers: [],
  providers: [NotificationService, AssignMemberService],
})
export class AppModule {}
