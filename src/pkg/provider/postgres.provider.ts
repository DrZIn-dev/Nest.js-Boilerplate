import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DatabaseConfig } from '../config/database.config';
import { GenericConfig } from '../config/generic.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        dbConfig: ConfigType<typeof DatabaseConfig>,
        genericCofig: ConfigType<typeof GenericConfig>,
      ) => ({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        autoLoadEntities: true,
        entities: [],
        synchronize: dbConfig.isSync,
        dropSchema:
          genericCofig.mode === 'production' ? false : dbConfig.isDrop,
        logging: dbConfig.isLog,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [DatabaseConfig.KEY, GenericConfig.KEY],
    }),
  ],
  exports: [TypeOrmModule],
})
export class PostgresProvider {}
