import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooksRecommended from 'eslint-plugin-react-hooks/recommended';
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import a11yRecommended from 'eslint-plugin-jsx-a11y/recommended';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactRecommended,
  reactHooksRecommended,
  reactJsxRuntime,
  a11yRecommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react': await import('eslint-plugin-react'),
      'react-hooks': await import('eslint-plugin-react-hooks'),
      'jsx-a11y': await import('eslint-plugin-jsx-a11y'),
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/click-events-have-key-events': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
