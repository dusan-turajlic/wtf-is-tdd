import app from '../index';

jest.mock('http', () => ({
  createServer: jest.fn().mockImplementation(() => ({ listen: jest.fn() })),
}));

test('Application starts', () => {
  expect(app).toBeDefined();
});
