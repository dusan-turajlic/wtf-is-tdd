import Router from 'koa-router';

const register = (router: Router) => {
  router.get('/products', async ctx => {
    ctx.status = 200;
  });
};

export default { register };
