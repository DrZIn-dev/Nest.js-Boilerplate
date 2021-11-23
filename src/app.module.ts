import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { configService } from './config/config.service';
import { GlobalModule } from './global.module';
import { MemberModule } from './member/member.module';
import { TodoModule } from './todo/todo.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    MemberModule,
    AuthModule,
    GlobalModule,
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
