import { CreateMemberDto } from '@/member/dto/create-member.dto';
import { MemberService } from '@/member/member.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private memberService: MemberService) {}

  @Post('/register')
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'Member Create Successful.',
  })
  @ApiBadRequestResponse({ description: 'Member Request Body Invalid.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  public async register(@Body() createMemberDto: CreateMemberDto) {
    return await this.memberService.create(createMemberDto);
  }
}
