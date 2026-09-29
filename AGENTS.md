# homacom — Agent Instructions

## Code discovery: use CodeGraph first (this repo overrides the global codebase-memory default)

This repository is indexed with CodeGraph — a live index lives in `.codegraph/`
at the repo root (Vue 3 / Nuxt 4 / TypeScript).

For any code question (locate a component, trace who calls a function, read a
symbol's source, impact analysis), reach for **codegraph before**
grep/glob/Read and before the codebase-memory-mcp graph tools:

- MCP: `codegraph_explore` — verbatim line-numbered source + call paths in one
  call. The codegraph MCP server resolves this project automatically from the
  session working directory; if a query misses it, pass
  `projectPath: /home/masoudi/Projects/pouria/homacom` explicitly.
- CLI (always works): `codegraph explore "<question>"` from this directory.

Only fall back to grep/glob/Read for string literals, config values,
non-code files, or when codegraph returns nothing useful.

Keep the index fresh: run `codegraph sync` (or `codegraph status` to check
staleness) after significant edits.

## Responsive breakpoints: mobile + desktop only

The app has exactly **two** responsive tiers:

- **mobile** — base styles (no Tailwind variant)
- **desktop** — `lg:` (and its `max-lg:` counter-variant), 64rem / 1024px

`sm:` / `md:` / `xl:` / `2xl:` (and their `max-*` forms) are deliberately
disabled via `--breakpoint-*: initial` in `app/assets/css/tailwind.css`, so using
them is a silent no-op. To add a tier later, define one breakpoint in that file
(e.g. `--breakpoint-md: 48rem;`) and update `app/utils/breakpoints.ts`.

Use `DESKTOP_MEDIA_QUERY` from `~/utils/breakpoints` for JS media-query checks —
never hard-code widths. Run `pnpm lint:breakpoints` (also wired into the
pre-commit hook) to verify no other tiers have crept back in.
