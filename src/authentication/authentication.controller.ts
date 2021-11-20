import { JwtAuthGuard } from '@/jwt-auth.guard';
import { LocalAuthGuard } from '@/local-auth.guard';
import { Member } from '@/member.decorator';
import { CreateMemberDto } from '@/member/dto/create-member.dto';
import { MemberService } from '@/member/member.service';
import { Member as MemberEntity } from '@/model/member.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private memberService: MemberService,
    private authenticationService: AuthenticationService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Member() user: MemberEntity) {
    return this.authenticationService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Member() member: MemberEntity) {
    return member;
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
