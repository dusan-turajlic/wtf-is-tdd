import request from 'supertest';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import HttpStatusCode from '../../enum/http';
import ProductService from '../../services/Product';
import { app } from '../../server';
import { Product } from '../../representations';
import { UpdateProduct } from '../../validators';

const file = fs.readFileSync(path.resolve('src/controllers/__test__/images/pot.jpeg'));

describe('Products Controller', () => {
  it('get all products', async () => {
    const response = await request(app.callback())
      .get('/products')
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Phone', amount: 0, description: 'A phone', price: 299.99, images: [] }),
        expect.objectContaining({
          name: 'Book',
          amount: 10,
          description: 'A book',
          price: 14,
          images: expect.arrayContaining([expect.anything()]),
        }),
      ]),
    );
  });

  describe('create product', () => {
    const productPayload = {
      name: 'Pot',
      price: 29.99,
      description: 'A pot',
      amount: 4,
      images: [new Blob([file])],
    };

    it.each([[{ ...productPayload }], [{ ...productPayload, images: [] }]])('can create a product', async payload => {
      const response = await request(app.callback())
        .post('/products')
        .send(payload);

      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(await ProductService.getOne(response.body.productId)).toBeDefined();
    });

    it.each([
      [{ ...productPayload, milieusValue: 'DELETE FROM products' }],
      [{ name: productPayload.name }],
      [{ price: productPayload.price }],
      [{ amount: productPayload.amount }],
      [{ images: productPayload.images }],
      [{ name: -1 }],
      [{ price: -999 }],
      [{ amount: -10 }],
      [{ images: null }],
    ])('throws when odd values are given', async payload => {
      const response = await request(app.callback())
        .post('/products')
        .send(payload);

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    });
  });

  describe('product updates', () => {
    let initialProduct: z.infer<typeof Product>;
    beforeEach(async () => {
      initialProduct = await ProductService.createOne({
        name: 'Product name',
        description: 'Product description',
        price: 29.99,
        amount: 4,
      });
    });

    afterEach(async () => {
      await ProductService.deleteOne(initialProduct.productId);
    });

    it.each([
      [{ name: 'Just One' }],
      [{ amount: 3 }],
      [{ price: 50 }],
      [{ description: 'Just a description' }],
      [{ images: [new Blob([file])] }],
      [{ images: [] }],
      [
        {
          name: 'All properties',
          amount: 10,
          description: 'Product description',
          price: 999,
          images: [new Blob([file])],
        },
      ],
    ])('update products with any number of parameters', async (payload: z.infer<typeof UpdateProduct>) => {
      const response = await request(app.callback()).get(`/products/${initialProduct.productId}`);
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual(expect.objectContaining(initialProduct));

      const updateResponse = await request(app.callback())
        .patch(`/products/${initialProduct.productId}`)
        .send(payload);

      if (payload?.images) {
        // eslint-disable-next-line no-param-reassign
        payload.images = expect.arrayContaining(
          payload.images.map(() => expect.stringContaining(`/${updateResponse.body.productId}/`)),
        );
      }
      expect(updateResponse.status).toBe(HttpStatusCode.OK);
      expect(updateResponse.body).toEqual(expect.objectContaining({ ...initialProduct, ...payload }));
    });
  });

  it('can delete product', async () => {
    const product = await ProductService.createOne({
      name: 'Product to be deleted',
      price: 29.99,
      description: 'Product description',
      amount: 4,
    });
    const deleteResponse = await request(app.callback()).delete(`/products/${product.productId}`);
    expect(deleteResponse.status).toBe(HttpStatusCode.OK);

    const response = await request(app.callback()).get(`/products/${product.productId}`);
    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
  });
});
