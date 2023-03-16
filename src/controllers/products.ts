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
    .get('/products/:productId', async ctx => {
      const product = await ProductService.getOne(ctx.params.productId);

      ctx.status = HttpStatusCode.OK;
      ctx.body = product;
    })
    .post('/products', bodyParser(), async ctx => {
      ctx.body = await ProductService.createOne(ctx.request.body as CreateProductParams);
      ctx.status = HttpStatusCode.CREATED;
    })
    .patch('/products/:productId', bodyParser(), async ctx => {
      ctx.body = await ProductService.updateOne(ctx.params.productId, ctx.request.body as Partial<CreateProductParams>);
      ctx.status = HttpStatusCode.OK;
    });
};

export default { register };
