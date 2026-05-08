# CLAUDE.md

Guidance for Claude Code when working in this repository. Keep this file up
to date as the project evolves.

---

## Project: SIMCA / TAG Network — Windshield Claims Platform

A multi-portal internal tool for processing windshield insurance claims.
Frontend is a single-page React application that serves multiple portals
(Call Center Agent, Customer, Workshop, Technician) from one codebase, with
per-portal lazy-loaded routes.

**Backend:** NestJS (separate repo, uses git submodule for `featureinfrastructure`).
This repo is **frontend only**.

---

## Tech stack

- **React 19** with TypeScript
- **Vite** (with `@vitejs/plugin-react`)
- **Tailwind CSS v4** (theme via `@theme` in `src/styles/index.css`, no `tailwind.config.js`)
- **Redux Toolkit** + `react-redux` for shared state (typed hooks in `src/hooks/useAppStore.ts`)
- **React Router v7** (data router via `createBrowserRouter`)
- **React Hook Form** for all forms
- **clsx + tailwind-merge** combined as `cn()` in `src/utils/cn.ts`

---

## Standards documents (treat as authoritative)

- `frontend.md` (in conversation context, not committed) — security, state,
  validation, observability standards
- `security-pii.md` — PII handling, masking, data classification

Key non-negotiables from these docs:
- **Auth uses HttpOnly cookies** — no tokens in `localStorage`/Redux
- **All HTTP through `src/api/apiClient.ts`** — no scattered `fetch` calls
- **PII masked by default in lists** (use `src/lib/pii/mask.ts`)
- **Inputs debounced ≥300ms** (use `src/hooks/useDebouncedValue.ts`)
- **Submit buttons disabled during pending** (`isLoading` prop on Button)
- **Frontend permission checks are UX only** — backend is authoritative
- **No `dangerouslySetInnerHTML`** without sanitization
- **No `window.confirm/alert`** — use `useConfirm()` (`src/components/ui/ConfirmDialog.tsx`)

---

## Folder structure

```
src/
├── api/                    Shared HTTP client (cookie-aware fetch wrapper)
├── app/                    App.tsx — providers + RouterProvider
├── components/
│   ├── ui/                 Design-system primitives (Button, Input, Modal, etc.)
│   └── topbar/             Shared topbar widgets (notifications, lang, country, profile)
├── config/                 Env config (typed, single source for VITE_*)
├── features/
│   ├── auth/               Login pages, auth slice, auth API + mock
│   ├── call-center/        Call Center Portal (sidebar + dashboard + claims)
│   └── customer/           Customer Portal (multi-step wizard)
├── hooks/                  Shared hooks (typed Redux, useDebouncedValue)
├── lib/
│   ├── permissions/        roleHomePath + role labels
│   └── pii/                Display masking helpers
├── router/                 Routes + guards (RequireAuth, RequireAnon, RequireRole)
├── store/                  Redux store assembly
├── styles/                 index.css (Tailwind v4 + design tokens)
├── types/                  Shared types (api error envelope)
└── utils/                  cn(), format helpers
```

**Convention:** Each feature is self-contained. A feature's pages should never
import from another feature's folder. Shared concerns live in `components/ui`,
`hooks`, `lib`, or `utils`.

---

## Auth flow

- Per-portal login pages: `/call-center/login`, `/customer/login`
- Single-step **email + password** (cookie-based)
- After login, role determines home: `roleHomePath(user.role)`
- Deep-link preservation: `RequireAuth` saves intended path to
  `sessionStorage` under `simca-redirect-after-login`, login page consumes it
- **Dev mock active by default**: `VITE_USE_AUTH_MOCK=true` in `.env`. Any
  non-empty email + 4+ char password works. Mock state in `sessionStorage`
  under `simca-mock-session`. To use real backend, set the env var to `false`.

---

## Common commands

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # Production build (tsc -b && vite build)
npm run lint      # ESLint
npx tsc --noEmit -p tsconfig.app.json   # Type-check without emit
```

Run `npx tsc --noEmit ...` and `npm run build` after non-trivial changes.

---

## Conventions

- **TypeScript strict mode** — no `any`, prefer `unknown` + narrowing
- **Named exports** for components (no `default` exports for pages/components)
- **React 19 ref-as-prop** — no `forwardRef`
- **Functional components** only
- **No comments** unless explaining non-obvious why
- **Required field UX** — pass `required` prop on Input/Select/Textarea to render
  a red asterisk; pair with RHF `register('field', { required: '...' })` for validation
- **Modals** use `<Modal>` from `components/ui/Modal.tsx`. Auto-focus prefers
  `[data-autofocus]` → text inputs → buttons
- **Confirmations** use `useConfirm()` — async API, `variant: 'destructive'` for
  irreversible actions (focuses Cancel by default)
- **Format** money/dates/times via `src/utils/format.ts`

---

## Active todos / outstanding work

See `PROJECT_STATUS.md` for the detailed live status. High-level:

- ✅ Auth (login + redirect + guards + mock)
- ✅ Call Center Portal (Dashboard, Claims list, Claim details, New Claim form,
  Batched invoices, Communication modal)
- ✅ Customer Portal (login + 4-step submission wizard + success page)
- ⏳ i18n (EN/FR) integration
- ⏳ PII masking integration across list views
- ⏳ Workshop / Technician portals (only login routes scaffolded)
- ⏳ CSRF token injection (waiting on backend contract)
- ⏳ Real auth API integration (waiting on backend endpoints)
- ⏳ Notification real-time delivery (currently mock data)

---

## When making changes

1. Read `frontend.md` and `security-pii.md` requirements relevant to the change
2. Plan in TodoWrite before non-trivial work
3. Match existing patterns — check neighboring files
4. Run `npx tsc --noEmit -p tsconfig.app.json` after changes
5. Run `npm run build` before completing the task
6. Don't add new dependencies without flagging — current set is intentional
