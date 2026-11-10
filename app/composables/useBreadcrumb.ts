import type { BreadcrumbCrumb } from '~/utils/breadcrumbs'
import { buildBreadcrumbs } from '~/utils/breadcrumbs'

/**
 * Breadcrumb trail for the current route, resolved on the Nuxt side from
 * `useRoute()` (see `~/utils/breadcrumbs`).
 *
 * ```ts
 * const breadcrumb = useBreadcrumb()                  // static route
 * const breadcrumb = useBreadcrumb(() => product.title) // dynamic route leaf
 * ```
 */
export function useBreadcrumb(leaf?: MaybeRefOrGetter<string | undefined>) {
  const route = useRoute()

  return computed<BreadcrumbCrumb[]>(() => buildBreadcrumbs(route.path, toValue(leaf)))
}
