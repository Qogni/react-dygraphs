// @ts-check

import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import parserTs from '@typescript-eslint/parser'
import stylistic from '@stylistic/eslint-plugin'
import stylisticTs from '@stylistic/eslint-plugin-ts'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.recommended,
  {
    plugins: {
      '@stylistic/ts': stylisticTs,
    },
    languageOptions: {
      parser: parserTs,
      globals: {
        ...globals.browser,
        ...globals.chai,
        ...globals.mocha,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': ['off'],
      '@typescript-eslint/no-unused-vars': [
        'off',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@stylistic/brace-style': [1, '1tbs', {
        allowSingleLine: true,
      }],
    },
  },
  {
    files: ['karma-ci.conf.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
)
