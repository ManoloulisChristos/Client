// eslint.config.mjs
import { fixupConfigRules } from '@eslint/compat';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/dist/', // Simplified duplicates
      '**/.eslintrc.cjs',
      '**/node_modules/',
      '**/env.d.ts',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended'
    )
  ),
  {
    // <-- Add 'files' to this object
    files: ['src/**/*.{js,mjs,cjs,jsx,ts,tsx}'], // <-- Apply this config to these file types in src
    plugins: {
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['tip-position', 'is-open', 'hide', 'inkscape:label'],
        },
      ],
      'react/prop-types': 'off', // Use "off" or 0
      'no-unused-vars': 'warn', // Use "warn" or 1
      // Corrected and deduplicated a11y rules
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/aria-proptypes': 'off', // Correct rule name was 'aria-proptypes'
      // Removed the incorrect "jsx-a11y/jsx-a11y/..." rule
    },
  },
];
