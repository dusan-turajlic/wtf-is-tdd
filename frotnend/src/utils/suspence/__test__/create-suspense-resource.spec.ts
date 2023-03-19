import { createSuspenseResource } from '../create-suspense-resource';
import { describe, expect, it } from 'vitest';

const flushPromises = () =>
  new Promise((r) => {
    r(null);
  });
describe('createSuspenseResource', () => {
  it('will resolved data', async () => {
    const resolvedData = 'resolved data';
    const promise = new Promise<string>((resolve) => {
      resolve(resolvedData);
    });

    const result = createSuspenseResource<string>(promise);
    await flushPromises();
    const data = result.read();
    expect(data).toBe(resolvedData);
  });

  it('will rejected data', async () => {
    const rejectedData = 'rejected data';
    const promise = new Promise<string>((resolve, reject) => {
      reject(rejectedData);
    });

    const result = createSuspenseResource<string>(promise);
    await flushPromises();
    try {
      result.read();
    } catch (error) {
      expect(error).toMatch(rejectedData);
    }
  });

  it('will rejected suspender promise', async () => {
    const promise = new Promise<string>(() => {});

    const result = createSuspenseResource<string>(promise);
    await flushPromises();
    try {
      result.read();
    } catch (error) {
      expect(error).rejects.toThrow();
    }
  });
});
