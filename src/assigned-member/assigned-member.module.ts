import { Module } from '@nestjs/common';
import { AssignMemberService } from './assigned-member.service';

@Module({ providers: [AssignMemberService] })
export class AssignMemberModule {}
