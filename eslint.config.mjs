import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['src/shared/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/entities/*', '@/features/*', '@/app/*', '@/widgets/*', '@/processes/*'],
              message:
                'shared 레이어는 상위 레이어(app/processes/widgets/features/entities)를 참조할 수 없습니다.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/entities/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/app/*', '@/widgets/*', '@/processes/*'],
              message:
                'entities 레이어는 상위 레이어(app/processes/widgets/features)를 참조할 수 없습니다.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/*', '@/widgets/*', '@/processes/*'],
              message:
                'features 레이어는 상위 레이어(app/processes/widgets)를 참조할 수 없습니다.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/widgets/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/*', '@/processes/*'],
              message:
                'widgets 레이어는 상위 레이어(app/processes)를 참조할 수 없습니다.',
            },
            {
              group: [
                '@/features/*/ui/*',
                '@/features/*/api/*',
                '@/features/*/hooks/*',
                '@/features/*/lib/*',
                '@/features/*/model/*',
                '@/features/*/types/*',
              ],
              message:
                'widgets 레이어에서는 features 내부 경로 대신 공개 엔트리(index)를 사용하세요.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/processes/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/*'],
              message: 'processes 레이어는 app 레이어를 참조할 수 없습니다.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/features/*/ui/*',
                '@/features/*/api/*',
                '@/features/*/hooks/*',
                '@/features/*/lib/*',
                '@/features/*/model/*',
                '@/features/*/types/*',
              ],
              message:
                'app 레이어에서는 features 내부 경로 대신 공개 엔트리(index)를 사용하세요.',
            },
          ],
        },
      ],
    },
  },
  prettier,
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
