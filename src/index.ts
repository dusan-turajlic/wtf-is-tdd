import http from 'http';
import Koa from 'koa';
import knex from 'knex';
import { appConfig } from './config';

const app = new Koa();
const { env, name, version, host, port, dbHost, dbPort, dbName, dbUsername, dbPassword } = appConfig;

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

const httpServer = http.createServer(app.callback());

httpServer.listen({ host, port }, () => {
  // eslint-disable-next-line no-console
  console.info(`${name}@${version} server listening on ${host}:${port}, in ${env}`);
});

export default app;
