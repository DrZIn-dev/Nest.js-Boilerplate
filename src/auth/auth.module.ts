import { MemberService } from '@/member/member.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, MemberService, LocalStrategy],
})
export class AuthModule {}
