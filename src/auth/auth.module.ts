import { MemberService } from '@/member/member.service';
import { MemberEntity } from '@/model/member.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [AuthController],
  providers: [AuthService, MemberService, LocalStrategy],
})
export class AuthModule {}
