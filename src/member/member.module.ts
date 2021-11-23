import { Module } from '@nestjs/common';
import { MemberService } from './member.service';

@Module({
  imports: [],
  providers: [MemberService],
})
export class MemberModule {}
