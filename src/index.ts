import http from 'http';
import { appConfig } from './config';
import { app } from './server';

const { env, name, version, host, port } = appConfig;

const httpServer = http.createServer(app.callback());

httpServer.listen({ host, port }, () => {
  // eslint-disable-next-line no-console
  console.info(`${name}@${version} server listening on ${host}:${port}, in ${env}`);
});
