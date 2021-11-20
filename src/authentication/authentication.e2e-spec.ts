import { configService } from '@/config/config.service';
import { CreateMemberDto } from '@/member/dto/create-member.dto';
import { MemberService } from '@/member/member.service';
import { Member } from '@/model/member.entity';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datatype, internet, name } from 'faker';
import * as request from 'supertest';
import { AuthenticationModule } from './authentication.module';

describe('Cats', () => {
  let app: INestApplication;
  const mockUUID = datatype.uuid();
  let memberService = { create: () => mockUUID };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Member]),
        AuthenticationModule,
      ],
    })
      .overrideProvider(MemberService)
      .useValue(memberService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe(`POST /auth/register`, () => {
    it('Should Register Done', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          username: internet.userName(),
          name: name.findName(),
          password: internet.password(),
        } as CreateMemberDto)
        .expect(201)
        .then((response) => {
          const { text } = response;
          expect(text).toBe(memberService.create());
        });
    });
    it('Should Throw Error', () => {
      return request(app.getHttpServer()).post('/auth/register').expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
