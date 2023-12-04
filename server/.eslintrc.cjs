module.exports = {
  root: true,
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "extends": [
    'plugin:prettier/recommended',
  ],
  "parserOptions": {
    "ecmaVersion": 2020,
    "parser": '@babel/eslint-parser',
    "sourceType": "module",
  },
  "plugins": [
  ],
  "rules": {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-async-promise-executor': 'warn',
  }
}
