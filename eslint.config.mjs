// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { FlatCompat } from '@eslint/eslintrc'
import esLintJs from '@eslint/js'
import typeScriptParser from '@typescript-eslint/parser'
import esLintConfigPrettier from 'eslint-config-prettier'
import pluginImport from 'eslint-plugin-import'
import pluginJest from 'eslint-plugin-jest'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'
import { dirname } from 'path'
import typeScriptESLint from 'typescript-eslint'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const typeScriptESLintConfigBase = typeScriptESLint.configs.base
const typeScriptESLintConfigESLintRecommended = typeScriptESLint.configs.eslintRecommended
const typeScriptESLintConfigRecommended = typeScriptESLint.configs.recommended.find((recommended) => {
  if (recommended.name === 'typescript-eslint/recommended') {
    return recommended
  }
})

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  esLintConfigPrettier,
  {
    ignores: [
      'node_modules/**',
      'src/libs/$path.ts',
      '.next/**',
      '.storybook/',
      '.history/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '**/.DS_Store',
      'yarn.lock',
      'public/**',
      'storybook-static/**',
    ],
  },
  {
    name: 'for typescript',
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ...typeScriptESLintConfigBase.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.jest,
      },
      parser: typeScriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          impliedStrict: true,
        },
        tsconfigRootDir: __dirname,
        project: true,
      },
    },
    plugins: {
      ...typeScriptESLintConfigBase.plugins,
      import: pluginImport,
      jest: pluginJest,
      'simple-import-sort': pluginSimpleImportSort,
    },
    rules: {
      ...typeScriptESLintConfigESLintRecommended.rules,
      ...typeScriptESLintConfigRecommended.rules,
      indent: 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/prefer-interface': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'max-classes-per-file': ['error', 2],
      'no-bitwise': [
        'error',
        {
          allow: ['~'],
        },
      ],
      'import/order': 'off',
      'sort-keys': 'off',
      'no-multiple-empty-lines': 'off',
      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      'no-console': ['warn', { allow: ['info', 'error'] }],
      'unicorn/number-literal-case': 'off',
      'spaced-comment': ['error', 'always'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    name: 'for mjs',
    files: ['**/*.mjs'],
    ignores: [],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.jest,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
    },
    rules: {
      ...esLintJs.configs.recommended.rules,
      indent: 'off',
      'max-classes-per-file': ['error', 2],
      'no-bitwise': [
        'error',
        {
          allow: ['~'],
        },
      ],
      'import/order': 'off',
      'sort-keys': 'off',
      'no-multiple-empty-lines': 'off',
      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      'no-console': ['warn', { allow: ['info', 'error'] }],
      'unicorn/number-literal-case': 'off',
      'spaced-comment': ['error', 'always'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    name: 'for js',
    files: ['**/*.js'],
    ignores: [],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.jest,
      },
    },
  },
  ...storybook.configs['flat/recommended'],
]

export default eslintConfig
