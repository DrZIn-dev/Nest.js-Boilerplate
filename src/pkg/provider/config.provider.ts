import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from '../config/database.config';
import { GenericConfig } from '../config/generic.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig, GenericConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigProvider {}
