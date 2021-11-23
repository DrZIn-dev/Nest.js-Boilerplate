import { MemberEntity } from '@/model/member.entity';
import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';

export class CreateMemberDto extends PickType(MemberEntity, [
  'name',
  'username',
  'password',
] as const) {
  @Expose()
  password: string;
}
