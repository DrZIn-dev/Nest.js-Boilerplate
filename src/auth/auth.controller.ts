import { JwtAuthGuard } from '@/jwt-auth.guard';
import { LocalAuthGuard } from '@/local-auth.guard';
import { CreateMemberDto } from '@/member/member.dto';
import { MemberService } from '@/member/member.service';
import { MemberEntity } from '@/model/member.entity';
import { User } from '@/user.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWTPayload } from './jwt.strategy';

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
  public async profile(@User() jwtPayload: JWTPayload) {
    return jwtPayload;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() dto: CreateMemberDto) {
    return await this.memberService.create(dto);
  }
}
