import { Member } from '@/member.decorator';
import { CreateMemberDto } from '@/member/dto/create-member.dto';
import { MemberService } from '@/member/member.service';
import { Member as MemberEntity } from '@/model/member.entity';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Member() user: MemberEntity) {
    return user;
  }

  @Post('/register')
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'Member Create Successful.',
  })
  @ApiBadRequestResponse({ description: 'Member Request Body Invalid.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong.',
  })
  public async register(
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<string> {
    return await this.memberService.create(createMemberDto);
  }
}
