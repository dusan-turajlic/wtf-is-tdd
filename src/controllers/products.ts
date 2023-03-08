import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import HttpStatusCode from '../enum/http';
import ProductService, { CreateProductParams } from '../services/Product';

const register = (router: Router) => {
  router
    .get('/products', async ctx => {
      const products = await ProductService.getAll();

      ctx.status = HttpStatusCode.OK;
      ctx.body = products;
    })
    .post('/products', bodyParser(), async ctx => {
      ctx.body = await ProductService.createOne(ctx.request.body as CreateProductParams);
      ctx.status = HttpStatusCode.CREATED;
    });
};

export default { register };
