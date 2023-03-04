import dotenv from 'dotenv';

const { name, version } = require('../package.json');

dotenv.config();

export const appConfig = {
  env: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || name,
  version,
  host: process.env.APP_HOST || '0.0.0.0',
  port: process.env.APP_PORT || 7070,
};
