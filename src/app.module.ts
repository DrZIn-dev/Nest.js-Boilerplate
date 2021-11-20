import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { configService } from './config/config.service';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    MemberModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
