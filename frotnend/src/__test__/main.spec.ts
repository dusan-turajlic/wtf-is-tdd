import { test } from 'vitest';
import { screen } from '@testing-library/react';

test('hello world', async () => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.append(root);
  await import('../main');

  await screen.findByText('Hello World');
});
