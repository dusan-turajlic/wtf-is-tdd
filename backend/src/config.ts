import dotenv from 'dotenv';

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
  env: NODE_ENV,
  name: APP_NAME,
  host: APP_HOST,
  port: APP_PORT,

  dbHost: DB_HOST,
  dbPort: parseInt(DB_FORWARD_PORT as string, 10),
  dbName: DB_DATABASE,
  dbPassword: DB_PASSWORD,
  dbUsername: DB_USERNAME,
};
