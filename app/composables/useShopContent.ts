import type { BlogNavItem } from '~/data/blog'
import { blogNav } from '~/data/blog'
import type { Category } from '~/data/categories'
import { megaCategories } from '~/data/categories'

interface ApiCategory {
  id: number
  title: string
  slug?: string
  img?: string | null
  children?: ApiCategory[]
}

interface ApiBlogCategory {
  id: number
  title: string
  slug: string
  children?: ApiBlogCategory[]
}

function mapCategory(item: ApiCategory): Category {
  return {
    id: String(item.id),
    title: item.title,
    children: item.children?.length ? item.children.map(mapCategory) : undefined,
  }
}

function mapBlogCategory(item: ApiBlogCategory): BlogNavItem {
  return {
    slug: item.slug,
    label: item.title,
    children: (item.children ?? []).map(child => ({
      slug: child.slug,
      label: child.title,
    })),
  }
}

/**
 * Shop departments for the header mega menu.
 *
 * The designed mock tree is used until the API responds (and again if it
 * returns an empty list), so navigation is never blank on a cold/offline API.
 */
export function useProductCategories() {
  const api = useApi()

  const { data: categories, pending, error, refresh } = useAsyncData<Category[]>(
    'shop-product-categories',
    async () => {
      const res = await api.get<ApiCategory[]>('/shop/public/product-category')
      const items = Array.isArray(res.data) ? res.data : []
      return items.length ? items.map(mapCategory) : megaCategories
    },
    {
      server: false,
      lazy: true,
      default: () => megaCategories,
    },
  )

  return { categories, pending, error, refresh }
}

/** Blog categories for the blog header/drawer, with the mock tree as fallback. */
export function useBlogNav() {
  const api = useApi()

  const { data: navItems, pending, error, refresh } = useAsyncData<BlogNavItem[]>(
    'shop-blog-categories',
    async () => {
      const res = await api.get<ApiBlogCategory[]>('/shop/public/blog-category')
      const items = Array.isArray(res.data) ? res.data : []
      return items.length ? items.map(mapBlogCategory) : blogNav
    },
    {
      server: false,
      lazy: true,
      default: () => blogNav,
    },
  )

  return { navItems, pending, error, refresh }
}
