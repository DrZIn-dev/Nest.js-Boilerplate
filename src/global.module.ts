import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './auth/jwt.strategy';
import { configService } from './config/config.service';
import { MemberEntity } from './model/member.entity';
import { TodoEntity } from './model/todo.entity';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([TodoEntity, MemberEntity]),
  ],
  controllers: [],
  providers: [JwtStrategy],
  exports: [JwtModule, TypeOrmModule],
})
export class GlobalModule {}
