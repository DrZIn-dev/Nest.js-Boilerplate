import { Controller, Get } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  public async getAll() {
    return this.memberService.getAll();
  }
}
