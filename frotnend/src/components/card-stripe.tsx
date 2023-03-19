import { ReactNode } from 'react';
import {
  createSuspenseResource,
  SuspenseResource,
} from '../utils/suspence/create-suspense-resource';

type CardStripeProps<T> = {
  title: string;
  resource: SuspenseResource<T>;
  render: (response: T) => ReactNode;
};
export function CardStripe<T>({ title, resource, render }: CardStripeProps<T>) {
  const response = resource.read();

  return (
    <div className='bg-white'>
      <div className='py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8'>
        <div className='flex items-center justify-between px-4 sm:px-6 lg:px-0'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900'>{title}</h2>
          <a
            href='/#'
            className='hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block'
          >
            See everything
            <span aria-hidden='true'> &rarr;</span>
          </a>
        </div>

        <div className='relative mt-8'>
          <div className='relative -mb-6 w-full overflow-x-auto pb-6'>
            <ul className='mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0'>
              {render(response)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
