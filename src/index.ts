import http from 'http';
import { appConfig } from './config';
import { app } from './server';

const { env, name, host, port } = appConfig;

const httpServer = http.createServer(app.callback());

httpServer.listen({ host, port }, () => {
  // eslint-disable-next-line no-console
  console.info(`${name} server listening on ${host}:${port}, in ${env}`);
});
