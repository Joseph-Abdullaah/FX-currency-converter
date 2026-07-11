# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

A Frontend Mentor challenge: **FX Currency Checker** — a currency conversion UI backed by the Frankfurter/ECB exchange-rate API. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui (radix-nova style).

The user (Joseph) is treating this as a portfolio-quality build. Per [AGENTS.md](AGENTS.md), when acting in a mentoring capacity favor discussing trade-offs over handing over finished code — but note that instruction targets conversational mentoring, not this file's build tasks.

## Stack & tooling

- **Framework:** Next.js 16.2.6 (App Router, RSC on by default — add `"use client"` for state/handlers/browser APIs)
- **UI:** shadcn/ui, `style: "radix-nova"`, base = radix, icon library = `lucide-react`, base color = neutral
- **Styling:** Tailwind CSS v4 (CSS-first config, no `tailwind.config.js` — theme lives in [app/globals.css](app/globals.css))
- **State:** Zustand (`store/convert-store.ts`), persisted to localStorage
- **Data fetching:** TanStack Query v5, thin `fetcher` wrapper in `lib/fetcher.ts`, query keys centralized in `lib/query-keys.ts`
- **Package manager:** pnpm (`pnpm-workspace.yaml` present — always use `pnpm`, not `npm`/`yarn`)
- **Font:** JetBrains Mono only (both `--font-sans` and `--font-mono` point to it) — this is a monospace-only design
- **Linting/formatting:** ESLint (`eslint-config-next`), Prettier with `prettier-plugin-tailwindcss` (no semicolons, double quotes off/`singleQuote: false`, 80 col)

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm lint         # eslint
pnpm format       # prettier --write
pnpm typecheck    # tsc --noEmit
```

## Directory layout

```
app/                  # App Router entry: layout.tsx, page.tsx, globals.css, typography.css
components/            # feature components (flat, not colocated by route)
components/ui/         # shadcn primitives — do not hand-edit without shadcn CLI awareness
components/motion-primitives/  # third-party animation primitives (infinite-slider, progressive-blur)
hooks/                 # TanStack Query hooks (use-currencies, use-latest-rates, use-convert-currency, use-historical-rates)
lib/                   # fetcher, query-client, query-keys, cn() util
providers/             # QueryProvider, ThemeProvider
services/               # api.ts (fetch functions), endpoints.ts (API paths)
store/                 # Zustand stores
types/                 # shared TS types
public/assets/images/flags/  # country flag webp assets, keyed by lowercase ISO code
public/assets/fonts/jetbrains-mono/
.agents/skills/shadcn/  # shadcn skill docs (rules for forms, composition, styling, icons)
```

## Design system — use it, don't reinvent it

### Colors
[app/globals.css](app/globals.css) already defines the full shadcn semantic token set (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--card`, `--popover`, `--sidebar-*`, `--chart-*`) in OKLCH, mapped 1:1 from the Figma design tokens, for both light (`:root`) and dark (`.dark`) modes. **Always use semantic Tailwind classes** (`bg-primary`, `text-muted-foreground`, `border-border`) — never raw hex/oklch values or arbitrary color classes. The lime-green brand accent is `--primary` (`oklch(0.9157 0.2054 121.6363)`, ≈`#CEF739`); some older components hardcode `#CEF739`/`#171719` — treat those as legacy and migrate to tokens when touched.

### Typography
[app/typography.css](app/typography.css) defines the full type scale as Tailwind `@utility` classes — **use these instead of ad hoc `text-*`/`font-*`/`leading-*` combos**:

| Utility | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| `text-preset-1` | 2.5rem | 700 | 1 | -0.03125rem |
| `text-preset-1-fixed` | 2rem | 700 | 1 | -0.03125rem |
| `text-preset-2` | 1.25rem | 400 | 1.2 | -0.03125rem |
| `text-preset-2-bold` | 1.25rem | 700 | 1.4 | -0.03125rem |
| `text-preset-3` | 1rem | 400 | 1.2 | 0.0625rem |
| `text-preset-3-medium` | 1rem | 500 | 1.2 | 0.0625rem |
| `text-preset-3-bold` | 1rem | 700 | 1.1 | 0.0625rem |
| `text-preset-4` | 0.875rem | 400 | 1.2 | 0.0625rem |
| `text-preset-5` | 0.75rem | 400 | 1.2 | 0.03125rem |
| `text-preset-5-medium` | 0.75rem | 500 | 1.3 | 0.03125rem |
| `text-preset-6` | 0.625rem | 400 | 1 | 0 |

### shadcn/ui rules
Full rules live in [.agents/skills/shadcn/SKILL.md](.agents/skills/shadcn/SKILL.md) and `.agents/skills/shadcn/rules/*.md`. Key points enforced in this repo:
- Compose from existing `components/ui/*` primitives before adding new ones; check what's installed before running `add`.
- `className` is for layout only — never override component color/typography with arbitrary classes.
- `gap-*` on flex/grid, never `space-x-*`/`space-y-*`.
- `size-*` for equal width/height, `truncate` shorthand, `cn()` for conditional classes.
- No manual `dark:` overrides — rely on semantic tokens, which already have light/dark values.
- Forms use `FieldGroup`/`Field`, not raw `div`+`Label` stacks.
- Icons in buttons use `data-icon="inline-start"|"inline-end"`, no manual size classes.
- Run `npx shadcn@latest docs <component>` before using an unfamiliar component's API.

## Data layer

- `services/endpoints.ts` — API path constants (Frankfurter-style: `/currencies`, `/latest`).
- `services/api.ts` — fetch functions (`getCurrencies`, `convertCurrency`, `getLatestRates`, `getHistoricalRates`) built on `lib/fetcher.ts`.
- `hooks/use-*.ts` — one TanStack Query hook per API function; query keys come from `lib/query-keys.ts` (don't inline query keys).
- `store/convert-store.ts` — Zustand store for converter UI state (`amount`, `base`, `symbol`) with `swapCurrencies()`, persisted under localStorage key `converter-store`.

## Current state / in-progress areas

- [app/page.tsx](app/page.tsx) renders `Header` + `LiveMarkets`; `ConverterWrapper` is commented out — the converter card UI is mid-build.
- [components/currencyPicker.tsx](components/currencyPicker.tsx) (Combobox-based currency selector with flags, popular/other grouping) exists but isn't wired up yet — `sendCard.tsx`/`receiveCard.tsx` currently use a placeholder `CurrencyButton` (a bare `CommandDialog` with hardcoded items) instead.
- Several components hardcode inline SVGs (`favoriteButton.tsx`, `swapButton.tsx`, `logo.tsx`) and raw colors (`liveRates.tsx`, `liveMarkets.tsx`) rather than using `lucide-react` icons/semantic tokens — acceptable for now but worth normalizing if touched.
- No functionality (API wiring, form state, validation) should be added to UI-only work unless explicitly requested — the user is implementing behavior themselves; Claude's job in UI tasks is markup/styling using shadcn components and existing hooks/store as read-only reference, not new logic.

## MCP servers configured for this project ([.mcp.json](.mcp.json))

- `figma` (remote, `https://mcp.figma.com/mcp`, OAuth) — for pulling design specs/screenshots from the Figma file.
- `shadcn` (stdio, `npx shadcn@latest mcp`) — for searching/installing/inspecting shadcn registry components.

Both require the Claude Code session to be restarted (and Figma OAuth completed) after being added before their tools are available.
