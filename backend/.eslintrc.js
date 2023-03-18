module.exports = {
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/prefer-default-export': 'off',
    // Database uses snake case so its anoying to set disable this per line
    '@typescript-eslint/camelcase': 'off',
  },
};
