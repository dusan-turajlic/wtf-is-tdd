import { beforeEach, describe, it, expect } from 'vitest';
import { createProduct, mockAllProductEndpoint } from '../../utils/tests';
import { getAllProducts } from '../products';

describe('products requests', () => {
  const mockProducts = [createProduct(), createProduct()];
  beforeEach(() => {
    mockAllProductEndpoint(...mockProducts);
  });

  it('should return all products', async () => {
    const products = await getAllProducts();
    expect(products).toHaveLength(2);
    expect(products).toEqual(
      expect.arrayContaining(mockProducts.map((product) => expect.objectContaining(product))),
    );
  });
});
