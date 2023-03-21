import request from 'supertest';
import { z } from 'zod';
import HttpStatusCode from '../../enum/http';
import ProductService from '../../services/Product';
import { app } from '../../server';
import { Product } from '../../representations';
import { UpdateProduct } from '../../validators';

describe('Products Controller', () => {
  it('get all products', async () => {
    const bookProduct = await ProductService.createOne({
      name: 'Book',
      amount: 10,
      description: 'A book',
      price: 14,
    });

    const phoneProduct = await ProductService.createOne({
      name: 'Phone',
      amount: 0,
      description: 'A phone',
      price: 299.99,
    });

    const response = await request(app.callback())
      .get('/products')
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...phoneProduct }),
        expect.objectContaining({ ...bookProduct }),
      ]),
    );

    await ProductService.deleteOne(phoneProduct.productId);
    await ProductService.deleteOne(bookProduct.productId);
  });

  describe('create product', () => {
    const productPayload = {
      name: 'Pot',
      price: 29.99,
      description: 'A pot',
      amount: 4,
    };

    it('can create a product', async () => {
      const response = await request(app.callback())
        .post('/products')
        .send(productPayload);

      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(await ProductService.getOne(response.body.productId)).toBeDefined();
    });

    it.each([
      [{ ...productPayload, milieusValue: 'DELETE FROM products' }],
      [{ name: productPayload.name }],
      [{ price: productPayload.price }],
      [{ amount: productPayload.amount }],
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
      [
        {
          name: 'All properties',
          amount: 10,
          description: 'Product description',
          price: 999,
        },
      ],
    ])('update products with any number of parameters', async (payload: z.infer<typeof UpdateProduct>) => {
      const response = await request(app.callback()).get(`/products/${initialProduct.productId}`);
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toEqual(expect.objectContaining(initialProduct));

      const updateResponse = await request(app.callback())
        .patch(`/products/${initialProduct.productId}`)
        .send(payload);

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
