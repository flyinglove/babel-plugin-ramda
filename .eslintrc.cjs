module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  plugins: ['import'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.cjs', '.mjs']
      }
    }
  },
  ignorePatterns: ['**/lib/**'],
  overrides: [
    {
      files: ['**/test/**/*.js'],
      env: {
        mocha: true
      },
      rules: {
        'import/no-extraneous-dependencies': 'off'
      }
    },
    {
      files: ['**/test/fixtures/**/*.js', '**/test/error-fixtures/**/*.js'],
      rules: {
        'import/no-unresolved': 'off',
        'no-unused-vars': 'off'
      }
    }
  ]
};
