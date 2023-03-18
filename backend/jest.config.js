module.exports = {
  globals: {
    'ts-jest': { tsConfig: 'tsconfig.json' },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testMatch: ['**/src/**/__test__/**/*.spec.(ts|js)'],
  testEnvironment: 'node',
  silent: false,
  coveragePathIgnorePatterns: ['/node_modules/', '/__test__/', '/dist/'],
};