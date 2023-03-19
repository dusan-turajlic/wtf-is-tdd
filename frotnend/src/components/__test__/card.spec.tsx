import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../card';

describe('Card', () => {
  it('can render', async () => {
    const productName = 'Product Name';
    const productPrice = 20.99;
    const productImage = 'https://via.placeholder.com/150';

    render(
      <Card name={productName} image={productImage} price={productPrice} altText={productName} />,
    );

    const image = await screen.findByRole<HTMLImageElement>('img');
    expect(image.src).toBe(productImage);
    await screen.findByRole('heading', { name: productName });
    await screen.findByText(`${productPrice}€`);
  });
});
