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
        expect.objectContaining({ name: 'Book', price: 14 }),
        expect.objectContaining({ name: 'Phone', price: 299.99 }),
      ]),
    );
  });
});
