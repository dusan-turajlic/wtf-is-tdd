import { z } from 'zod';

export const Product = z.object({
  productId: z.string(),
  name: z.string(),
  amount: z.number(),
  // Price is sotred in cents in the datbase.
  price: z
    .number()
    .int()
    .transform(num => Number((num * 0.01).toFixed(2))),
  images: z.array(z.string()),
});
