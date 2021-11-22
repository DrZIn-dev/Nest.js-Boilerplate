import { configService } from '@/config/config.service';
import { MemberEntity } from '@/model/member.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
  ) {}

  public async create(dto: CreateMemberDto): Promise<MemberEntity['id']> {
    const newMember = new MemberEntity(dto);
    newMember.password = await hash(
      newMember.password,
      configService.getSaltRounds(),
    );
    const insertResult = await this.memberRepository.save(newMember);
    return insertResult.id;
  }

  public async findByUsername(
    username: MemberEntity['username'],
  ): Promise<MemberEntity> {
    return await this.memberRepository.findOne({ where: { username } });
  }
}
