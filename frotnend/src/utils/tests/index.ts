import { Product } from '../../types';
import { vi } from 'vitest';

export const createProduct = ({
  productId = (Math.random() + 1).toString(36).substring(2),
  name = 'Product',
  price = 99.99,
  amount = 100,
  images = [],
}: Partial<Product> = {}): Product => ({
  productId,
  name,
  price,
  amount,
  images,
});

export const mockAllProductEndpoint = (...mockProducts: Product[]) => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    json: vi.fn().mockResolvedValue(mockProducts),
  } as unknown as Response);
};
