import request from 'supertest';
import HttpStatusCode from '../../enum/http';
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
});
