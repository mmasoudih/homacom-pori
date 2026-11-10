/**
 * Route-driven breadcrumbs.
 *
 * The trail is a navigation concept, not content: every static page declares its
 * label here once, and `useBreadcrumb()` builds the trail from the current
 * route, so a page can never drift from its URL (or ship a hardcoded trail with
 * a typo). Dynamic routes pass their own leaf label.
 */

export interface BreadcrumbCrumb {
  /** Visible label. */
  label: string
  /** When present, the crumb is rendered as a link to this route. */
  to?: string
}

/** First crumb, shared by every page. */
export const HOME_CRUMB: BreadcrumbCrumb = { label: 'هماکام', to: '/' }

/** Labels keyed by route path (no trailing slash). Add a row when a page gains a breadcrumb. */
export const BREADCRUMB_LABELS: Record<string, string> = {
  '/brands': 'برندها',
  '/about-us': 'درباره ما',
  '/contact-us': 'تماس با ما',
  '/faq': 'سوالات متداول',
  '/installment': 'خرید اقساطی',
  '/branch': 'فروشگاه‌های حضوری',
  '/collaboration': 'پنل همکار و سازمانی',
  '/guarantee': 'راهنمای گارانتی',
  '/terms': 'شرایط و مقررات',
}

/** `/brands/` → `/brands`; the root stays `/`. */
export function normalizeRoutePath(path: string): string {
  const clean = path.split(/[?#]/)[0] ?? ''
  if (!clean || clean === '/') return '/'
  return clean.replace(/\/+$/, '')
}

/**
 * Trail for `path`: the home link plus the page itself.
 *
 * `leaf` overrides the registry lookup (dynamic routes such as a product page);
 * with neither a leaf nor a registry entry only the home crumb is returned, so
 * the header never renders an empty label.
 */
export function buildBreadcrumbs(path: string, leaf?: string): BreadcrumbCrumb[] {
  const normalized = normalizeRoutePath(path)
  if (normalized === '/') return []

  const label = leaf ?? BREADCRUMB_LABELS[normalized]
  return label ? [{ ...HOME_CRUMB }, { label }] : [{ ...HOME_CRUMB }]
}
