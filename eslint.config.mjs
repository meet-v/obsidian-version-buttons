import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import obsidianmd from 'eslint-plugin-obsidianmd';

export default tseslint.config(
  { ignores: ['main.js', 'node_modules/**', 'dist/**'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...obsidianmd.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { project: './tsconfig.json' },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-console': 'error',
    },
  },
);
