import { MemberEntity } from '@/model/member.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
  ) {}

  public async create(dto: CreateMemberDto): Promise<MemberEntity['id']> {
    const insertResult = await this.memberRepository.save(dto);
    return insertResult.id;
  }
}
