import { z } from 'zod';
import { ParameterizedContext } from 'koa';
import HttpStatusCode from '../enum/http';

export const CreateProduct = z
  .object({
    name: z.string(),
    amount: z.number(),
    price: z.number().multipleOf(0.01),
    description: z.optional(z.string()),
  })
  .strict();

export const UpdateProduct = CreateProduct.partial();

// eslint-disable-next-line consistent-return
export const validateRequest = <T extends z.ZodRawShape>(zodObject: z.ZodObject<T>, ctx: ParameterizedContext) => {
  try {
    return zodObject.parse(ctx.request.body);
  } catch (error) {
    // For some reason a catch error parameter must be any or unknown
    const zodError = error as z.ZodError;
    ctx.throw(HttpStatusCode.BAD_REQUEST, zodError.message);
  }
};
