import z from 'zod';
import { ParameterizedContext } from 'koa';
import { validateRequest } from '../index';

test('can catch parsing issues', () => {
  expect(() => {
    validateRequest(z.object({ a: z.string() }), { request: { body: { a: 1 } } } as ParameterizedContext);
  }).toThrow();
});
