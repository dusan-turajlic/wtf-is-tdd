import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { router } from './router';

export const app = new Koa();

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(bodyParser());
