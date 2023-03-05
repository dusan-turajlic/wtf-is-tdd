import { connection, app } from '../server';

jest.mock('http', () => ({
  createServer: jest.fn().mockImplementation(() => ({ listen: jest.fn() })),
}));

test('Application starts', () => {
  expect(app).toBeDefined();
});

test('Database connection', async () => {
  const response = await connection.raw('SELECT 1');
  expect(response).toBeDefined();
});
