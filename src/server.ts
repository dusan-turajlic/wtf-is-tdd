import Koa from 'koa';
import knex from 'knex';
import { appConfig } from './config';
import { router } from './router';

const { dbHost, dbPort, dbName, dbUsername, dbPassword } = appConfig;

export const app = new Koa();

// Apply routes
app.use(router.routes());

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
