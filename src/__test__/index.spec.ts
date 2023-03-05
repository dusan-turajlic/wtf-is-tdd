import app, { knex } from '../index';

jest.mock('http', () => ({
  createServer: jest.fn().mockImplementation(() => ({ listen: jest.fn() })),
}));

test('Application starts', () => {
  expect(app).toBeDefined();
});

test('Database connection', async () => {
  const one = await knex.raw('SELECT 1');
  expect(one).toBe(1);
});
