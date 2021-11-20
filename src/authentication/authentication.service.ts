import { ValidateMemberDto } from '@/member/dto/validate-member.dto';
import { MemberService } from '@/member/member.service';
import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private memberService: MemberService) {}

  public async validateMember(validateMemberDto: ValidateMemberDto) {
    const { username, name, password } =
      (await this.memberService.findByUsername(validateMemberDto.username)) ||
      {};
    if (password) {
      const comparePassword = await compare(
        validateMemberDto.password,
        password,
      );
      if (comparePassword) {
        return { name, username };
      }
    }
    return null;
  }
}
