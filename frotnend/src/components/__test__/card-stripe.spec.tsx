import { describe, it, expect } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { CardStripe } from '../card-stripe';
import { Suspense } from 'react';
import { createSuspenseResource } from '../../utils/suspence/create-suspense-resource';

describe('Card stripe', () => {
  it('can render', async () => {
    const title = 'Title';
    const fallbackText = 'Loading...';
    const responseText = 'Child';
    const resource = createSuspenseResource(
      new Promise<string>((resolve) => setTimeout(() => resolve(responseText), 1)),
    );
    render(
      <Suspense fallback={<div>{fallbackText}</div>}>
        <CardStripe
          title={title}
          resource={resource}
          render={(response) => <div>{response}</div>}
        ></CardStripe>
      </Suspense>,
    );

    await waitForElementToBeRemoved(() => screen.getByText(fallbackText));

    screen.getByRole('heading', { name: title });
    screen.getByText('See everything');
    screen.getByText(responseText);
  });
});
