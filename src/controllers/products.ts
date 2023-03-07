import Router from 'koa-router';
import HttpStatusCode from '../enum/http';
import ProductService from '../services/Product';

const register = (router: Router) => {
  router.get('/products', async ctx => {
    ctx.status = HttpStatusCode.OK;
    const products = await ProductService.getAll();

    ctx.body = products;
  });
};

export default { register };
