import { MemberService } from '@/member/member.service';
import { Member } from '@/model/member.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [AuthenticationService, MemberService, LocalStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
