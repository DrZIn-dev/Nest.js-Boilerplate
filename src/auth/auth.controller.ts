import { JwtAuthGuard } from '@/jwt-auth.guard';
import { LocalAuthGuard } from '@/local-auth.guard';
import { CreateMemberDto } from '@/member/member.dto';
import { MemberService } from '@/member/member.service';
import { MemberEntity } from '@/model/member.entity';
import { User } from '@/user.decorator';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private memberService: MemberService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(@User() member: MemberEntity) {
    return this.authService.login(member);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  public async profile(@User() jwtPayload: MemberEntity) {
    return this.memberService
      .findById(jwtPayload.id)
      .then((e) => new MemberEntity(e));
    // return jwtPayload;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  public async register(@Body() dto: CreateMemberDto) {
    return await this.memberService.create(dto);
  }
}
