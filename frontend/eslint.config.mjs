import { fixupConfigRules } from '@eslint/compat';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  ...fixupConfigRules(compat.extends('eslint:recommended', 'plugin:react/recommended', 'prettier')),

  {
    plugins: {
      prettier,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y
    },

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true // ✅ Habilita JSX corretamente
        }
      }
    },

    settings: {
      react: {
        version: 'detect' // ✅ Detecta a versão instalada do React
      }
    },

    rules: {
      'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.mjs'] }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-autofocus': 'off',

      // ✅ Prettier agora funciona corretamente sem conflito com ESLint
      'prettier/prettier': [
        'warn',
        {
          bracketSpacing: true,
          printWidth: 100,
          singleQuote: true,
          trailingComma: 'none',
          tabWidth: 2,
          useTabs: false
        }
      ]
    }
  },
  {
    ignores: ['dist', 'build', 'coverage', 'node_modules'],
    files: ['src/**/*.{js,jsx,mjs}']
  }
];
