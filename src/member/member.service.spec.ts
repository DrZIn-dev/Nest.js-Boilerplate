import { configService } from '@/config/config.service';
import { Member } from '@/model/member.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as faker from 'faker';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Member]),
      ],
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be create member', async () => {
    const insertId = await service.create({
      name: faker.name.findName(),
      username: faker.internet.userName(),
      password: faker.internet.password(8),
    });
    expect(typeof insertId).toBe('string');
  });
});
