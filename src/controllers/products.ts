import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { z } from 'zod';
import HttpStatusCode from '../enum/http';
import ProductService from '../services/Product';
import { CreateProduct, UpdateProduct, validateRequest } from '../validators';

const register = (router: Router) => {
  router
    .get('/products', async ctx => {
      const products = await ProductService.getAll();

      ctx.status = HttpStatusCode.OK;
      ctx.body = products;
    })

    .get('/products/:productId', async ctx => {
      const product = await ProductService.getOne(ctx.params.productId);

      if (!product) {
        ctx.status = HttpStatusCode.NOT_FOUND;
        return;
      }

      ctx.status = HttpStatusCode.OK;
      ctx.body = product;
    })

    .post('/products', bodyParser(), async ctx => {
      ctx.body = await ProductService.createOne(validateRequest(CreateProduct, ctx));
      ctx.status = HttpStatusCode.CREATED;
    })

    .patch('/products/:productId', bodyParser(), async ctx => {
      ctx.body = await ProductService.updateOne(ctx.params.productId, validateRequest(UpdateProduct, ctx));
      ctx.status = HttpStatusCode.OK;
    })

    .delete('/products/:productId', async ctx => {
      await ProductService.deleteOne(ctx.params.productId);

      ctx.status = HttpStatusCode.OK;
    });
};

export default { register };
