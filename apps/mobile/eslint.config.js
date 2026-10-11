import { config as baseConfig } from '@repo/eslint-config';

export default [
  ...baseConfig,
  {
    ignores: ['dist/**', '.expo/**', 'node_modules/**'],
  },
  {
    settings: { react: { version: 'detect' } },
  },
];
