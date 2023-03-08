import request from 'supertest';
import HttpStatusCode from '../../enum/http';
import ProductService from '../../services/Product';
import { app } from '../../server';

describe('Products Controller', () => {
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
    const resposnse = await request(app.callback())
      .post('/products')
      .send(payload);

    expect(resposnse.status).toBe(HttpStatusCode.CREATED);
    expect(await ProductService.getOne(resposnse.body.productId)).toBeDefined();
  });
});
