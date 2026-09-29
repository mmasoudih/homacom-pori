/**
 * Single source of truth for the app's two responsive tiers.
 *
 * - Mobile  = base styles (no Tailwind variant)
 * - Desktop = `lg:` / 64rem / 1024px
 *
 * Keep this in sync with `--breakpoint-lg` in `~/assets/css/tailwind.css`.
 */
export const DESKTOP_BREAKPOINT_PX = 1024

/** Media query matching the desktop tier, for `useMediaQuery` / `window.matchMedia`. */
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_BREAKPOINT_PX}px)`
