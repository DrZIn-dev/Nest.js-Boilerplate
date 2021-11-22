import { MemberEntity } from '@/model/member.entity';
import { PickType } from '@nestjs/mapped-types';

export class LoginDto extends PickType(MemberEntity, [
  'username',
  'password',
] as const) {}
