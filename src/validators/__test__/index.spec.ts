import z from 'zod';
import { ParameterizedContext } from 'koa';
import { validateRequest } from '../index';
import HttpStatusCode from '../../enum/http';

test('can catch parsing issues', () => {
  const throwMock = jest.fn();
  validateRequest(z.object({ a: z.string() }), ({
    request: { body: { a: 1 } },
    throw: throwMock,
  } as unknown) as ParameterizedContext);
  expect(throwMock).toBeCalledWith(HttpStatusCode.BAD_REQUEST, expect.any(String));
});
