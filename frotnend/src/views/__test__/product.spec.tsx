import { describe, it, expect, beforeAll } from 'vitest';
import { ProductView } from '../product';
import { render, screen, within } from '@testing-library/react';
import { createProduct, mockAllProductEndpoint } from '../../utils/tests';

describe('Product', () => {
  const mockProducts = [
    createProduct({
      name: 'Product nr 1',
      price: 399.99,
      amount: 2,
      images: ['https://picsum.photos/200/300'],
    }),
    createProduct({
      name: 'Product nr 2',
      price: 199.99,
      amount: 4,
      images: ['https://picsum.photos/200/300'],
    }),
    createProduct({
      name: 'Product nr 3',
      price: 29.99,
      amount: 10,
      images: ['https://picsum.photos/200/300'],
    }),
    createProduct({
      name: 'Product nr 4',
      price: 19.99,
      amount: 5,
      images: ['https://picsum.photos/200/300'],
    }),
    createProduct({
      name: 'Product nr 5',
      price: 59.99,
      amount: 60,
      images: ['https://picsum.photos/200/300'],
    }),
    createProduct({
      name: 'Product nr 6',
      price: 79.99,
      amount: 2,
      images: ['https://picsum.photos/200/300'],
    }),
    createProduct({
      name: 'Product nr 7',
      price: 79.99,
      amount: 2,
      images: null,
    }),
  ];
  beforeAll(() => {
    mockAllProductEndpoint(...mockProducts);
    render(<ProductView />);
  });

  it.each(mockProducts.map((prod) => [prod]))(
    'can render products page with all products',
    async ({ productId, name, price, images }) => {
      const listItem = await screen.findByTestId(productId);
      const parentElement = within(listItem);
      parentElement.getByRole('heading', { name });
      parentElement.getByText(`${price}€`);

      const image = parentElement.getByRole<HTMLImageElement>('img');
      const expectedImageSrc = images?.[0] ?? '';
      expect(image.src).toBe(expectedImageSrc);
    },
  );
});
