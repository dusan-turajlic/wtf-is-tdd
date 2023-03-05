import Koa from 'koa';
import { router } from './router';

export const app = new Koa();

// Apply routes
app.use(router.routes());
