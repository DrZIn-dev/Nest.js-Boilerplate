import { IsString } from 'class-validator';

export class CreateAssignMemberDto {
  @IsString({ each: true })
  members: string[];
}
