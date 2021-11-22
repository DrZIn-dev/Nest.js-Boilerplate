import { MemberService } from '@/member/member.service';
import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private memberService: MemberService) {}
}
