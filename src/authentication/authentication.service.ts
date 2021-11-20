import { ValidateMemberDto } from '@/member/dto/validate-member.dto';
import { MemberService } from '@/member/member.service';
import { Member } from '@/model/member.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
  ) {}

  public async validateMember(validateMemberDto: ValidateMemberDto) {
    const { id, username, name, password } =
      (await this.memberService.findByUsername(validateMemberDto.username)) ||
      {};
    if (password) {
      const comparePassword = await compare(
        validateMemberDto.password,
        password,
      );
      if (comparePassword) return { name, username, id };
    }
    return null;
  }

  public async login(member: Member) {
    const jwtPayload = {
      username: member.username,
      name: member.name,
      sub: member.id,
    };

    return {
      access_token: this.jwtService.sign(jwtPayload),
    };
  }
}
