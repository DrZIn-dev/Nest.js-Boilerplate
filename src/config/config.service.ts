import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    /* istanbul ignore next */
    if (!value && throwOnMissing)
      throw new Error(`config error - missing env.${key}`);

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getJwtSecret() {
    return this.getValue('JWT_SECRET', true);
  }

  public getSaltRounds() {
    return 8;
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: [
        'src/model/**/*.entity{.ts,.js}',
        'dist/model/**/*.entity{.ts,.js}',
      ],

      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      migrationsRun: Boolean(this.getValue('RUN_MIGRATIONS')),
      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
      keepConnectionAlive: true,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'RUN_MIGRATIONS',
  'JWT_SECRET',
]);

export { configService };
