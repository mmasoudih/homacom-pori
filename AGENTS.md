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
