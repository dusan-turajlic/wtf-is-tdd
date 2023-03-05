import Koa from 'koa';
import knex from 'knex';
import { appConfig } from './config';

const { dbHost, dbPort, dbName, dbUsername, dbPassword } = appConfig;

export const app = new Koa();
export const connection = knex({
  client: 'pg',
  connection: {
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: dbName,
  },
  useNullAsDefault: true,
});
