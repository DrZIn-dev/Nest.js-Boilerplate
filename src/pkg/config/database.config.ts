import { registerAs } from '@nestjs/config';
import { parseBoolean } from '../utility/parser.utility';

export const DatabaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_DATABASE || 'postgres',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  isSync: parseBoolean(process.env.DB_SYNC || 'false'),
  isDrop: parseBoolean(process.env.DB_DROP || 'false'),
  isLog: parseBoolean(process.env.DB_LOG || 'false'),
}));
