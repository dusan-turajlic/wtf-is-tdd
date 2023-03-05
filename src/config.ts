import dotenv from 'dotenv';

const { name, version } = require('../package.json');

dotenv.config();

const {
  NODE_ENV,
  APP_NAME,
  APP_HOST,
  APP_PORT,

  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_FORWARD_PORT,
} = process.env;

export const appConfig = {
  env: NODE_ENV || 'development',
  name: APP_NAME || name,
  version,
  host: APP_HOST || '0.0.0.0',
  port: APP_PORT || 7070,

  dbHost: DB_HOST,
  dbPort: parseInt(DB_FORWARD_PORT ?? '0', 10) || 5432,
  dbName: DB_DATABASE,
  dbPassword: DB_PASSWORD,
  dbUsername: DB_USERNAME,
};
