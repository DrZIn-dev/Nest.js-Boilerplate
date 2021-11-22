import { MemberService } from '@/member/member.service';
import { MemberEntity } from '@/model/member.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
  ) {}

  public async login(member: MemberEntity) {
    const jwtPayload = {
      username: member.username,
      name: member.name,
      sub: member.id,
    };

    return this.jwtService.sign(jwtPayload);
  }

  public async validateMember(dto: LoginDto): Promise<MemberEntity> {
    const member = await this.memberService.findByUsername(dto.username);
    if (member) {
      const comparePassword = await compare(dto.password, member.password);
      if (comparePassword) return member;
    }
    return null;
  }
}
