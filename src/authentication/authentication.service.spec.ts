import { configService } from '@/config/config.service';
import { CreateMemberDto } from '@/member/dto/create-member.dto';
import { MemberService } from '@/member/member.service';
import { Member } from '@/model/member.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as faker from 'faker';
import { internet } from 'faker';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let memberService: MemberService;
  let mockMember: CreateMemberDto = {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    password: faker.internet.password(8),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Member]),
      ],
      providers: [AuthenticationService, MemberService],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    memberService = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(authenticationService).toBeDefined();
  });

  describe('Member Validate', () => {
    it('Should Validate Done', async () => {
      await memberService.create(mockMember);
      const result = await authenticationService.validateMember({
        username: mockMember.username,
        password: mockMember.password,
      });
      expect(result.username).toBe(mockMember.username);
      expect(result.name).toBe(mockMember.name);
    });

    it('Should Validate Fail When Dont Match username', async () => {
      const result = await authenticationService.validateMember({
        username: internet.userName(),
        password: mockMember.password,
      });
      expect(result).toBe(null);
    });
  });
});
