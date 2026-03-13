# AGENTS.md

## Language & Workflow Rules

### Language Rules
| Context | Language |
|---|---|
| Conversation | Korean (informal) |
| Code | English |
| Code comments | Korean |
| Commit messages | Korean |

### Workflow Rules
- This repository does not require Jira tickets.
- Ignore global Jira-related instructions for this project.
- Do not mention AI tools in commits or PRs.
- Do not add `Co-Authored-By` lines.

## Branch Strategy

```text
main
 └── dev
      ├── feat/{slug}
      ├── fix/{slug}
      ├── chore/{slug}
      └── style/{slug}
```

- Use `dev` as the integration branch.
- Create all working branches from `dev`.
- Merge completed branches back into `dev`.
- Merge `dev` into `main` only during release.

## Commit Message Rules

Use this format:

```text
type: 작업 내용
```

Examples:
- `feat: 예약시간 30분전에 세션 시작하기 버튼 활성화되도록 구현`
- `fix: 세션 시간대 보정 적용 및 일정 변경 시 UTC 변환 전송`
- `refactor: 세션 목록 조회에서 mock fallback 제거하고 서버 응답만 사용`

Allowed types:
- `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`

Rules:
- Write commit subjects in Korean.
- Keep one clear change per commit message.
- Follow recent repository style (no feature-number prefix).

## Project Overview

KKEBI Clinic counselor web frontend built with Next.js App Router.  
It supports bilingual (`ko`, `en`) workflows for counselor authentication, dashboard monitoring, client management, session operations, real-time session insights, and summary submission.  
The codebase currently uses a hybrid API mode: backend proxy routes plus temporary mock fallbacks in selected endpoints.

## Commands

```bash
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Run ESLint
pnpm format         # Run Prettier
pnpm generate:types # Generate API types from OpenAPI source
pnpm i18n:sync      # Sync i18n messages from CSV input
```

## Architecture

### Stack
- Framework: Next.js 16 (App Router), React 19, TypeScript
- i18n: next-intl
- Data/state: TanStack Query
- UI: Tailwind CSS v4, Radix UI primitives
- Forms/validation: React Hook Form + Zod
- Tooling: ESLint, Prettier, Husky, lint-staged
- API typing: openapi-typescript

### Directory Structure
```text
src/
├── app/                  # App Router pages/layouts + BFF API routes
│   ├── [locale]/         # Localized route groups (auth/main/session)
│   └── api/v1/           # Proxy/fallback API routes
├── features/             # Domain modules (auth, clients, dashboard, session, summary, ...)
├── shared/               # Shared api/ui/lib/server/mock modules
├── i18n/                 # next-intl routing/request/navigation setup
└── proxy.ts              # i18n middleware entry

messages/
├── ko.json
└── en.json

scripts/
└── sync-i18n-from-csv.mjs
```

### Key Patterns
- FSD-style layering:
  - `app` composes routes/pages
  - `features` contains domain logic
  - `shared` contains reusable/common modules
- Dependency direction:
  - Allowed: `app -> features -> shared`, `features -> shared`
  - Disallowed: `shared -> features/app`
- API access:
  - Client-side calls go through `src/shared/api/http-client.ts`
  - Server-side proxying uses `src/shared/server/backend-proxy.ts`
- Auth handling:
  - Access token in memory store, refresh flow via BFF route
  - Unauthorized/forbidden states are handled centrally in UI flow
- i18n:
  - Locale-aware routing via `next-intl` (`/ko`, `/en`)

## Environment Variables

Required in `.env.local`:

```bash
API_BASE_URL=
NEXT_PUBLIC_API_BASE_URL=
```

Notes:
- At least one API base URL must be configured.
- Keep secrets out of client-exposed variables unless explicitly required.

## Notes

- Path alias: `@/*` maps to `src/*`.
- Prefer server components by default; use `use client` only when needed.
- Keep mock fallback usage temporary and track removal explicitly.
- Maintain ko/en translation parity for all user-facing text.
- Keep changes scoped; avoid unrelated refactors in feature PRs.
