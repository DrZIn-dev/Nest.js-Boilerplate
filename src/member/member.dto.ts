import { MemberEntity } from '@/model/member.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateMemberDto extends PickType(MemberEntity, [
  'name',
  'username',
  'password',
] as const) {}
