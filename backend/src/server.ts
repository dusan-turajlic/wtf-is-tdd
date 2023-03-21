import Koa from 'koa';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import { router } from './router';

export const app = new Koa();

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());
