export interface SuspenseResource<T> {
  /**
   * @throws an error according to the Suspense contract
   */
  read(): T;
}

export function createSuspenseResource<T>(promise: Promise<T>): SuspenseResource<T> {
  let status = 'pending';
  let result: T;
  const suspender = promise
    .then((r) => {
      status = 'success';
      result = r;
    })
    .catch((e) => {
      status = 'error';
      result = e;
    });

  return {
    read(): T {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      }

      return result;
    },
  };
}
