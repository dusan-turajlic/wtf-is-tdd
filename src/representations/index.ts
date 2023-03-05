import { z } from 'zod';

export const Product = z.object({
  productId: z.string(),
  name: z.string(),
  amount: z.number(),
  // Price is sotred in cents in the datbase.
  price: z.number().transform(num => num * 0.01),
  images: z.array(z.string()),
});
