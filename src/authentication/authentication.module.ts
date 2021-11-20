import { configService } from '@/config/config.service';
import { MemberService } from '@/member/member.service';
import { Member } from '@/model/member.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthenticationService, MemberService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
