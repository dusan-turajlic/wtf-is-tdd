import { connection } from '../db';
import { app } from '../server';

test('Application starts', () => {
  expect(app).toBeDefined();
});

test('Database connection', async () => {
  const response = await connection().raw('SELECT 1');
  expect(response).toBeDefined();
});
