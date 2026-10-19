import type { FaqItem } from '~/components/pages/FaqAccordion.vue'
import type { ChipItem } from '~/components/pages/ChipRow.vue'
import type { BlogNavItem } from '~/data/blog'
import { blogNav } from '~/data/blog'
import type { Category } from '~/data/categories'
import { megaCategories } from '~/data/categories'
import type { BrandItem } from '~/data/pages/brands'
import { brandsPage } from '~/data/pages/brands'
import { faqCategories, faqItems } from '~/data/pages/faq'
import { resolveMediaUrl } from '~/utils/media'

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

interface ApiBrand {
  id: number
  title: string
  title_en?: string | null
  slug?: string
  img?: string | null
}

interface ApiFaqSubject {
  id: number
  title: string
  items?: Array<{
    id: number
    question: string
    answer: string
  }>
}

const faqIcons = ['package', 'credit', 'delivery', 'return', 'user', 'tag', 'products'] as const

function absoluteMedia(path?: string | null): string {
  const config = useRuntimeConfig()
  return resolveMediaUrl(path, String(config.public.apiBase || ''))
}

/** Brand list, falling back to the designed mock list when the API is empty. */
export function useBrands() {
  const api = useApi()

  const { data: brandItems, pending, error, refresh } = useAsyncData<BrandItem[]>(
    'shop-brands',
    async () => {
      const res = await api.get<ApiBrand[]>('/shop/brands')
      const items = Array.isArray(res.data) ? res.data : []
      if (!items.length) return brandsPage.items

      return items.map(item => ({
        name: item.title,
        titleEn: item.title_en ?? undefined,
        logo: absoluteMedia(item.img),
      }))
    },
    {
      server: false,
      lazy: true,
      default: () => brandsPage.items,
    },
  )

  return { brandItems, pending, error, refresh }
}

export interface FaqContent {
  categories: ChipItem[]
  items: FaqItem[]
}

/** FAQ subjects + questions, falling back to the designed mock content. */
export function useFaqs() {
  const api = useApi()

  const { data: faqContent, pending, error, refresh } = useAsyncData<FaqContent>(
    'shop-faqs',
    async () => {
      const res = await api.get<ApiFaqSubject[]>('/shop/faqs')
      const subjects = Array.isArray(res.data) ? res.data : []
      if (!subjects.length)
        return { categories: faqCategories, items: faqItems }

      const categories: ChipItem[] = []
      const items: FaqItem[] = []

      subjects.forEach((subject, index) => {
        const id = String(subject.id)
        categories.push({
          id,
          label: subject.title,
          icon: faqIcons[index % faqIcons.length]!,
        })

        for (const item of subject.items ?? []) {
          items.push({
            categoryId: id,
            question: item.question,
            answer: item.answer,
          })
        }
      })

      return { categories, items }
    },
    {
      server: false,
      lazy: true,
      default: () => ({ categories: faqCategories, items: faqItems }),
    },
  )

  return { faqContent, pending, error, refresh }
}
