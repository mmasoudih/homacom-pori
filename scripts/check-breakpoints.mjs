#!/usr/bin/env node
/**
 * Breakpoint guard.
 *
 * The app has exactly two responsive tiers:
 *   - mobile  = base styles (no variant)
 *   - desktop = `lg:` / `max-lg:` (64rem / 1024px)
 *
 * This script fails if any other responsive variant shows up in app code, which
 * would otherwise be a silent no-op because the matching `--breakpoint-*` values
 * are removed in `app/assets/css/tailwind.css`.
 *
 * Usage: node scripts/check-breakpoints.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIR = join(ROOT, 'app')
const EXTENSIONS = ['.vue', '.ts', '.css']

// A responsive variant token, e.g. `sm:`, `md:`, `xl:`, `2xl:`, `max-sm:`,
// `min-[600px]:`, `max-[900px]:` — but not `lg:` / `max-lg:`.
const FORBIDDEN_RE =
  /(?:^|[^\w-])((?:max-)?(?:sm|md|xl|2xl)|(?:min|max)-\[[^\]]+\]):/g

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (EXTENSIONS.some(ext => entry.endsWith(ext))) out.push(full)
  }
  return out
}

const violations = []
for (const file of walk(SCAN_DIR)) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    for (const match of line.matchAll(FORBIDDEN_RE)) {
      violations.push({
        file: relative(ROOT, file),
        line: i + 1,
        token: match[1] + ':',
        text: line.trim(),
      })
    }
  })
}

if (violations.length > 0) {
  console.error(
    `\n✖ Found ${violations.length} non-desktop breakpoint usage(s).\n` +
      '  Only the mobile base and `lg:`/`max-lg:` (1024px) are allowed.\n' +
      '  See app/assets/css/tailwind.css for the breakpoint definition.\n',
  )
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  [${v.token}]  ${v.text.slice(0, 120)}`)
  }
  console.error('')
  process.exit(1)
}

console.log('✔ Breakpoints OK — only the mobile base and `lg:`/`max-lg:` are used.')
