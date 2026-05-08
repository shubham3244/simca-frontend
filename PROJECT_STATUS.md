# SIMCA Frontend — Project Status

**Last updated:** May 2026 (during active development)

---

## What's built

### Foundation
- Vite + React 19 + TypeScript scaffold
- Tailwind CSS v4 with design tokens (`src/styles/index.css`) — TAG NETWORK navy `#0A233F` primary, light blue-grey `#F2F4FA` cards, semantic destructive/muted/etc.
- Redux Toolkit store with typed `useAppDispatch` / `useAppSelector`
- Shared API client (`src/api/apiClient.ts`) with cookie auth (`credentials: 'include'`), error normalization to canonical envelope
- Env config (`src/config/env.ts`) — `API_BASE_URL`, `USE_AUTH_MOCK`
- Error envelope types (`src/types/api.types.ts`)

### Design system primitives (`src/components/ui/`)
- `Button` — 5 variants (primary, secondary, ghost, destructive, outline), 3 sizes, `isLoading` state, left/right icon slots, React 19 ref-as-prop
- `Input` — label, error, helperText, left/right icons, `required` asterisk
- `Select` — native styled select with custom chevron, `required`
- `Textarea` — same shape as Input + `rightLabelSlot` (used for word counters)
- `Modal` — portal-rendered, body scroll lock, Esc to close, backdrop click, focus management with `[data-autofocus]` priority
- `ConfirmDialog` + `useConfirm()` hook + `<ConfirmProvider>` — async `await confirm({...})` API, themed (replaces `window.confirm`)
- `Dropdown` + `DropdownItem` — click-outside, Esc to close
- `Tabs` — generic, navy fill on active state
- `KpiCard`, `StatusBadge`, `ProgressBar`, `Field`, `Stepper`, `FullPageSpinner`, `TagNetworkBrand`

### Topbar widgets (`src/components/topbar/`) — shared across portals
- `NotificationsBell` (mock data, red badge with count)
- `LanguageSwitcher` (EN / FR — display only, no real i18n yet)
- `CountrySwitcher` (CA / US / AU with lowercase code prefix)
- `ProfileMenu` (Profile Settings / Logout — wires to `logoutThunk`)

### Auth (`src/features/auth/`)
- **Per-portal login** at `/call-center/login` and `/customer/login`
- `LoginShell` reusable component — split-panel design (dark navy brand panel + white form panel), responsive
- Email + password fields with eye-toggle, Remember me, Forgot password link slot
- `loginThunk`, `logoutThunk`, `fetchMeThunk` in slice
- **Dev mock** at `auth.api.mock.ts` — backed by `sessionStorage`, accepts any non-empty email + 4+ char password, assigns role from portal
- `useSessionBootstrap` runs `fetchMe` on app mount
- Route guards:
  - `RequireAuth` — accepts `loginPath` prop, saves deep-link to `sessionStorage`
  - `RequireAnon` — redirects authenticated users to `roleHomePath(user.role)`
  - `RequireRole` — enforces allowed roles, redirects mismatches

### Call Center Portal (`src/features/call-center/`)
- **Layout:** dark navy sidebar (Dashboard / Claims Management / Settings) + white topbar (Home + portal title + widgets) + scrollable main. Layout uses `h-screen overflow-hidden` so only main scrolls (sidebar is locked).
- **Dashboard page:** SLA Compliance card, Avg Response Time card, Claims at Risk card, Agent Queue Management table with colored Pending column + SLA progress bars
- **Claims Management list:** search (debounced 300ms, phone-format-agnostic match — `555-2` finds `(555) 234-5678`), status filter (8 options), table with status badges (7 distinct color variants), chat-bubble icon per row
- **Claim Details:** breadcrumb-style header with status badge, tabbed content (Claim Info / Parts & Invoice). Claim Info tab has 6 sections: Claim Information, Customer Information, Vehicle Information, Work Order Notes, Confidence Score, Recommended Parts. Parts & Invoice tab has Parts List, Labour & Pricing Breakdown, Shop Invoice form, Calculate button, Upload Invoice Copy.
- **New Claim form:** 4-section form (Claim Info / Customer / Vehicle / Work Order Notes) with React Hook Form, action bar (Existing Client Search, Send Work Order PDF, View Logs, Print Claim, Cancel), sticky footer (Cancel + Save & Continue), word counters (200 word limit), required-field validation
- **Batched Invoices:** simple list with Print + View Claims actions, exported Yes/No badges
- **Communication modal:** chat between Call Center Agent and Workshop, scrollable message list, optimistic send, Send Alert (with confirm), Enter-to-send, smart timestamps (`Today, 10:30 AM` / `Yesterday, ...` / `Mar 24, ...`), draft-protection on close

### Customer Portal (`src/features/customer/`)
- **Layout:** topbar only (no sidebar) — TAG brand + Home + "Customer Portal" + lang/country/profile
- **Submit Claim wizard (4 steps):**
  - Step 1: Your Information (9 fields incl. address)
  - Step 2: Vehicle Details (year, make, model, color, VIN with 17-char check, odometer)
  - Step 3: Incident Details (date of loss, cause dropdown, damage description, insurance, policy, optional claim number)
  - Step 4: Upload Documents — drag-drop zones for damage photos (required) + supporting docs (optional), file list with remove buttons
  - Single React Hook Form across all steps, per-step validation via `trigger(fields)`, stepper allows backward navigation only
- **Success page:** green check, claim reference number, Submit Another Claim button

### Routing & code-splitting
- All portal pages **lazy-loaded** via `React.lazy()` with `Suspense` + `<FullPageSpinner />`
- Login pages stay eager (entry points)
- Build output: ~82KB gzipped initial + tiny per-page chunks (1-15KB each)
- Customer never downloads Call Center code, and vice versa

---

## What's pending

### Backend integration (waiting on backend team)
- Real auth endpoints (`/auth/login`, `/auth/me`, `/auth/logout`)
- Claims CRUD (currently mock data in `src/features/call-center/data/`)
- Customer wizard submit endpoint
- File upload endpoint (currently UI-only — files held in component state)
- Communication / messages endpoint (currently mock per claim)
- Notifications real-time channel (currently mock data)
- Confidence score / recommended parts (currently mock)

### Security wiring (waiting on backend contracts)
Per `frontend.md` and `security-pii.md`:
- **CSRF token injection** in `apiClient` — needs backend to confirm strategy + header name
- **Correlation ID** capture — needs backend to confirm header name (`X-Request-Id`?)
- **Idempotency keys** for non-idempotent mutations (POST claims, payments)
- **Request timeouts / AbortController** on apiClient
- **401 response handler** — clear Redux + redirect to login (currently scaffolded, not wired)
- **Rate-limit (`429`) handler** — show user message respecting `Retry-After`
- **Error code taxonomy** alignment with backend

### Frontend features still to build
- **Workshop Portal** (login route scaffolded, no pages)
- **Technician Portal** (login route scaffolded, no pages)
- **Settings pages** for each portal (placeholder text only)
- **Profile Settings page** (linked from ProfileMenu, no page yet)
- **Forgot Password flow** — link slot in LoginShell, no page yet
- **i18n (EN/FR)** — language switcher is display-only; need to wire `react-i18next` + `messages.{en,fr}.json` files + replace hardcoded strings
- **PII masking integration** in list/detail views — utilities exist (`src/lib/pii/mask.ts`) but not wired into components yet (Section 6.1 of `security-pii.md`)
- **Claim Details PDF export / Print Claim** — buttons exist, only `window.print()` wired
- **Audit log / View Logs modal** — button exists, no implementation
- **Existing Client Search** modal — button exists, opens "coming soon" alert
- **NAGS parts catalog integration** — "Add from NAGS" button placeholder
- **Real-time updates** — when workshop sends a chat message, agent should see it without refresh (websocket or SSE)
- **Notifications** — currently mock dropdown, needs real channel + mark-as-read

### Quality gates not yet set up
- **Tests** — no Vitest/RTL setup yet; `frontend.md` standards imply test coverage
- **ESLint strict typed-rules** — basic ESLint scaffolded by Vite, not yet hardened (see `README.md` snippet for full config)
- **Pre-commit hooks** (Husky + lint-staged) — not set up
- **CI** — no GitHub Actions yet

---

## Architecture decisions made

| Decision | Why |
|---|---|
| Single React app, lazy-split per portal | Small team, heavy code reuse (auth, design system). Multi-app monorepo would multiply overhead. Lazy chunks already give per-portal isolation in the bundle. |
| Tailwind v4 with `@theme` (no config file) | Tokens in CSS = single source of truth, design-mode-friendly, no JS config to keep in sync |
| React Hook Form (not Formik / RTK forms) | Lightest, typed, integrates with our Input components via `register()` spread |
| `useConfirm()` async hook, not per-component dialogs | Cleaner API at call sites (`await confirm(...)`), single mount point, no prop drilling |
| `sessionStorage` for mock auth and deep-link redirect | Per-tab isolation, survives reload, cleared by browser closing |
| Modal via `createPortal` to `document.body` | Avoids parent stacking-context bugs, clean z-index |
| Status badges use Tailwind palette (not custom theme tokens) | The 7 statuses are content, not brand — tokenizing them was over-abstracting |
| Approve / Reject / Calculate semantic colors stay green/red | Even in an "internal tool" palette, semantic action colors aid scanability |

---

## Known issues / paper cuts

- The `@theme` directive triggers a VS Code CSS-validator warning. Harmless. Install the **Tailwind CSS IntelliSense** extension to silence it.
- Vite config currently warns about a transient peer-dep mismatch on `react-router-dom@7` — non-blocking.
- Native `<input type="date">` look varies across browsers. Acceptable for v1; revisit if Figma demands consistent visuals.
- Auto-generated control numbers in New Claim are random per page mount. Real backend will assign — currently mock-only behavior.

---

## Mock-mode toggles

`.env`:
```
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_USE_AUTH_MOCK=true
```

To switch to real backend: set `VITE_USE_AUTH_MOCK=false` and update `VITE_API_BASE_URL`.

---

## Picking up from here (for a fresh Claude instance)

1. Run `npm install` (deps are checked into `package.json` / `package-lock.json`)
2. Read `CLAUDE.md` (top-level conventions)
3. Read this file (detailed status)
4. Run `npm run dev` and walk the app:
   - `/` → bounces to `/call-center/login`
   - Log in (any email, 4+ char password)
   - Click around Dashboard, Claims Management, click a control number for details, "+ New Claim", "Batched Invoices", chat icon on a row
   - `/customer/login` → log in → see the 4-step wizard, walk all steps, submit
5. Pick up from "What's pending" — i18n and PII masking are the next two natural steps
