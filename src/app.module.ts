import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), MemberModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
