import { CreateMemberDto } from '@/member/member.dto';
import { MemberService } from '@/member/member.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private memberService: MemberService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() dto: CreateMemberDto) {
    return await this.memberService.create(dto);
  }
}
