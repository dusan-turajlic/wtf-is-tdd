import request from 'supertest';
import HttpStatusCode from '../../enum/http';
import ProductService from '../../services/Product';
import { app } from '../../server';

describe('Products Controller', () => {
  beforeAll(async () => {});
  it('get all products', async () => {
    const response = await request(app.callback())
      .get('/products')
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Phone', amount: 0, price: 299.99, images: [] }),
        expect.objectContaining({
          name: 'Book',
          amount: 10,
          price: 14,
          images: expect.arrayContaining([expect.anything()]),
        }),
      ]),
    );
  });

  it('create product', async () => {
    const payload = {
      name: 'Pot',
      price: 29.99,
      amount: 4,
      images: ['https://i.imgur.com/oXRmvsF.jpeg'],
    };
    const response = await request(app.callback())
      .post('/products')
      .send(payload);

    expect(response.status).toBe(HttpStatusCode.CREATED);
    expect(await ProductService.getOne(response.body.productId)).toBeDefined();
  });

  it('update products', async () => {
    const product = await ProductService.createOne({
      name: 'Product name',
      price: 29.99,
      amount: 4,
    });

    const response = await request(app.callback()).get(`/products/${product.productId}`);
    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toEqual(expect.objectContaining(product));

    const payload = {
      name: 'new Product Name',
      amount: 3,
    };

    const updateResponse = await request(app.callback())
      .patch(`/products/${product.productId}`)
      .send(payload);

    expect(updateResponse.status).toBe(HttpStatusCode.OK);
    expect(updateResponse.body).toEqual(expect.objectContaining({ ...product, ...payload }));
  });
});
