import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './auth/jwt.strategy';
import { configService } from './config/config.service';
import { AssignedMemberEntity } from './model/assigned-member.entity';
import { MemberEntity } from './model/member.entity';
import { TodoEntity } from './model/todo.entity';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      redis: configService.getRedisConfig(),
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([TodoEntity, MemberEntity, AssignedMemberEntity]),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: configService.getRateLimit(),
    }),
  ],
  controllers: [],
  providers: [JwtStrategy],
  exports: [JwtModule, TypeOrmModule, ThrottlerModule, BullModule],
})
export class GlobalModule {}
