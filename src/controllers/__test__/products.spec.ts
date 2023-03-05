import request from 'supertest';
import HttpStatusCode from '../../enum/http';
import { app } from '../../server';

describe('Products Controller', () => {
  it('get all products', async () => {
    const response = await request(app.callback())
      .get('/products')
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
  });
});
