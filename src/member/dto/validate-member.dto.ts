import { OmitType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';

export class ValidateMemberDto extends OmitType(CreateMemberDto, [
  'name',
] as const) {}
