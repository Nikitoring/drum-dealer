import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import typescript from 'typescript-eslint';

const sharedRules = {
  quotes: ['warn', 'single', { avoidEscape: true }],
  'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
  'no-shadow': 'error',
  'no-else-return': 'error',
  'no-lonely-if': 'error',
  'no-unneeded-ternary': 'error',
  'prefer-arrow-callback': 'error',
  'prefer-const': 'error',
  'require-await': 'error',
  'prettier/prettier': [
    'warn',
    {
      endOfLine: 'auto'
    }
  ]
};

export default [
  {
    ignores: ['dist/**', 'coverage/**']
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: sharedRules
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript.plugin,
      prettier: prettierPlugin
    },
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          caughtErrors: 'none',
          destructuredArrayIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      ...sharedRules
    }
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: sharedRules
  }
];
