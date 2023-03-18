import { Product } from '../index';

describe('Product', () => {
  const basicProduct = {
    productId: '123',
    name: 'Product name',
    amount: 4,
    price: 2999,
    images: ['https://i.imgur.com/oXRmvsF.jpeg'],
  };

  it('Does not throw when parsing', () => {
    expect(() => {
      Product.parse({
        ...basicProduct,
      });
    }).not.toThrow();
  });

  it('Maps price correctly', () => {
    const parsed = Product.parse({
      ...basicProduct,
    });

    expect(parsed.price).toBe(29.99);
  });

  it.each([
    [{ ...basicProduct, productId: 1 }],
    [{ ...basicProduct, name: {} }],
    [{ ...basicProduct, price: 22.99 }],
    [{ ...basicProduct, images: null }],
  ])('throws when odd values are given', params => {
    expect(() => {
      Product.parse(params);
    }).toThrow();
  });
});
