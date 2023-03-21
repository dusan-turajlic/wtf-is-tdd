import { z } from 'zod';

export const Product = z.object({
  productId: z.string(),
  name: z.string(),
  amount: z.number(),
  description: z.optional(z.string()),
  // Price is stored in cents in the database.
  price: z
    .number()
    .int()
    .transform(num => Number((num * 0.01).toFixed(2))),
  images: z.array(z.string()),
});
