import type { Category } from '~/data/categories'

/**
 * The category id plus every descendant id, as integers.
 *
 * The designed fallback tree uses string ids (`mobile`, `honor`, …), so
 * non-numeric entries are dropped and callers fall back to a title search.
 */
export function categoryIdList(category?: Category | null): number[] {
  if (!category) return []

  const ids: number[] = []
  const walk = (node: Category) => {
    const id = Number(node.id)
    if (Number.isInteger(id) && id > 0) ids.push(id)
    node.children?.forEach(walk)
  }
  walk(category)

  return ids
}

/**
 * Route to the product list filtered by `category` and all of its descendants.
 *
 * `/search` is the app's only product listing page. It maps `?categories=` onto
 * the backend `filters[categories][]` (one id per selected node, children
 * included) and uses `name` for the heading instead of a text query.
 */
export function categoryListRoute(category: Category) {
  const ids = categoryIdList(category)
  if (!ids.length) {
    // Nothing numeric to filter by (designed fallback tree) — keep the old
    // title-search behaviour rather than linking to an empty id list.
    return { path: '/search', query: { q: category.title } }
  }

  return {
    path: '/search',
    query: {
      categories: ids.join(','),
      name: category.title,
    },
  }
}
