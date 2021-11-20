import { CreateMemberDto } from '@/member/dto/create-member.dto';
import { MemberService } from '@/member/member.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthenticationController {
  constructor(private memberService: MemberService) {}

  @Post('/register')
  public async register(@Body() createMemberDto: CreateMemberDto) {
    return await this.memberService.create(createMemberDto);
  }
}
