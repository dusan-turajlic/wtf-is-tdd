import Router from 'koa-router';
import ProductsRoutes from './controllers/products';

const router = new Router();

ProductsRoutes.register(router);

export { router };
