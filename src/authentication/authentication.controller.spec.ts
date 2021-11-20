import { configService } from '@/config/config.service';
import { CreateMemberDto } from '@/member/dto/create-member.dto';
import { MemberService } from '@/member/member.service';
import { Member } from '@/model/member.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datatype, internet, name } from 'faker';
import { AuthenticationController } from './authentication.controller';

describe('AuthenticationController', () => {
  let authenticationController: AuthenticationController;
  let memberService: MemberService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Member]),
      ],
      controllers: [AuthenticationController],
      providers: [MemberService],
    }).compile();

    authenticationController = module.get<AuthenticationController>(
      AuthenticationController,
    );
    memberService = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(authenticationController).toBeDefined();
  });

  describe('Register Member', () => {
    it('Should Register Done', async () => {
      const mockResult = datatype.uuid();
      jest
        .spyOn(memberService, 'create')
        .mockImplementation(() => Promise.resolve(mockResult));
      const newMember: CreateMemberDto = {
        name: name.findName(),
        username: internet.userName(),
        password: internet.password(),
      };
      expect(await authenticationController.register(newMember)).toBe(
        mockResult,
      );
    });
  });
});
