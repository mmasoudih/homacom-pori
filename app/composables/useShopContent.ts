import type { FaqItem } from '~/components/pages/FaqAccordion.vue'
import type { ChipItem } from '~/components/pages/ChipRow.vue'
import type { SearchColorOption } from '~/data/search'
import { searchColorOptions } from '~/data/search'
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

interface ApiBanner {
  id: number
  position: string
  link?: string | null
  target?: string | null
  image?: string | null
}

export interface BannerItem {
  image: string
  alt?: string
  href?: string
}

export interface HomeBanners {
  hero: BannerItem[]
  two: BannerItem[]
  three: BannerItem[]
  four: BannerItem[]
  strip: BannerItem
}

function mapBanner(item: ApiBanner, apiBase: string): BannerItem {
  return {
    image: resolveMediaUrl(item.image, apiBase),
    alt: 'بنر هماکام',
    href: item.link || '#',
  }
}

/**
 * Home-page banners grouped by the design slots.
 *
 * Falls back to the designed mock banners per slot when the API has nothing
 * for that position, so the landing page keeps its layout on a cold API.
 */
export function useHomeBanners() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { bannerSlots } = useBannersFallback()

  const { data } = useAsyncData<HomeBanners>(
    'shop-home-banners',
    async () => {
      try {
        const res = await api.get<ApiBanner[]>('/shop/banners')
        const items = (res.data ?? []).map(item => ({ ...mapBanner(item, apiBase), position: item.position }))
        if (!items.length) return bannerSlots.value

        const byPosition = (position: string) => items.filter(item => item.position === position)
        const pick = (positions: string[]) => positions.flatMap(byPosition).map(({ position: _position, ...banner }) => banner)

        return {
          hero: pick(['index_slider']).length ? pick(['index_slider']) : bannerSlots.value.hero,
          two: pick(['index_middle_first', 'index_middle_second']).slice(0, 2).length
            ? pick(['index_middle_first', 'index_middle_second']).slice(0, 2)
            : bannerSlots.value.two,
          four: pick(['index_middle_first', 'index_middle_second', 'index_middle_therd', 'index_middle_forth']).slice(0, 4).length
            ? pick(['index_middle_first', 'index_middle_second', 'index_middle_therd', 'index_middle_forth']).slice(0, 4)
            : bannerSlots.value.four,
          three: pick(['index_middle_first', 'index_middle_second', 'index_middle_therd']).slice(0, 3).length
            ? pick(['index_middle_first', 'index_middle_second', 'index_middle_therd']).slice(0, 3)
            : bannerSlots.value.three,
          strip: pick(['index_header_top'])[0] ?? bannerSlots.value.strip,
        }
      }
      catch {
        return bannerSlots.value
      }
    },
    { server: false, lazy: true, default: () => bannerSlots.value },
  )

  return { banners: data }
}

/** Designed banner fallbacks, kept in one place for the composable above. */
function useBannersFallback() {
  const bannerSlots = computed<HomeBanners>(() => ({
    hero: [1, 2, 3].map(index => ({
      image: `/figma/fill-${index === 1 ? '4f5b0b1a98425788' : index === 2 ? 'fc0d272a9ceafa5f' : 'f48409b4bd7d0235'}.jpg`,
      alt: 'هماکام',
      href: '#',
    })),
    two: [
      { image: '/figma/fill-e44e4b8ead1c759d.png', alt: 'بنر هماکام', href: '#' },
      { image: '/figma/fill-07e29b135a3cb6e8.png', alt: 'بنر هماکام', href: '#' },
    ],
    three: [
      { image: '/figma/fill-b65ebd18e4d5d2f9.png', alt: 'بنر هماکام', href: '#' },
      { image: '/figma/fill-e2020cdafb96743f.png', alt: 'بنر هماکام', href: '#' },
      { image: '/figma/fill-9eca5bf432eebd3d.png', alt: 'بنر هماکام', href: '#' },
    ],
    four: [
      { image: '/figma/fill-b65ebd18e4d5d2f9.png', alt: 'بنر هماکام', href: '#' },
      { image: '/figma/fill-e4d8a4e475bb2dd8.png', alt: 'بنر هماکام', href: '#' },
      { image: '/figma/fill-e2020cdafb96743f.png', alt: 'بنر هماکام', href: '#' },
      { image: '/figma/fill-9eca5bf432eebd3d.png', alt: 'بنر هماکام', href: '#' },
    ],
    strip: { image: '/figma/fill-b57f0152df1c2d25.png', alt: 'پیشنهاد ویژه هماکام', href: '#' },
  }))

  return { bannerSlots }
}

/* -------------------------------------------------------------------------- */
/* Public shell: colours, site header, footer                                  */
/* -------------------------------------------------------------------------- */

interface ApiColor {
  id: number
  title: string
  title_en?: string | null
  code: string
}

interface ApiMenu {
  title: string
  link?: string | null
  target?: string | null
  class?: string | null
  icon?: string | null
  sort?: number | null
}

interface ApiSiteHeader {
  menus?: ApiMenu[]
  logo?: string | null
  logo_dark?: string | null
  tel?: string | null
  mobile?: string | null
  blog_title?: string | null
  description?: string | null
}

type ApiFooterMenu = ApiMenu

interface ApiSiteFooter {
  menu_1?: ApiFooterMenu[]
  menu_2?: ApiFooterMenu[]
  menu_3?: ApiFooterMenu[]
  menu_4?: ApiFooterMenu[]
  logo?: string | null
  logo_dark?: string | null
  tel?: string | null
  mobile?: string | null
  email?: string | null
  address?: string | null
  description?: string | null
  footer_copy_write?: string | null
  instagram?: string | null
  linkedin?: string | null
  telegram?: string | null
  twitter?: string | null
  watsapp?: string | null
  currency?: string | null
  blog_title?: string | null
}

/** Product colours for the search facet (designed list as fallback). */
export function useShopColors() {
  const api = useApi()

  const { data: colors } = useAsyncData<SearchColorOption[]>(
    'shop-colors',
    async () => {
      const res = await api.get<ApiColor[]>('/shop/public/colors')
      const items = Array.isArray(res.data) ? res.data : []
      if (!items.length) return searchColorOptions

      return items
        .filter(color => !!color.code)
        .map(color => ({
          id: String(color.id),
          label: color.title,
          swatch: `linear-gradient(135deg, ${color.code} 0%, ${color.code} 55%, ${color.code} 100%)`,
          dot: color.code,
        }))
    },
    { server: false, lazy: true, default: () => searchColorOptions },
  )

  return { colors }
}

/** Header shell: menus, logo and phone numbers. */
export function useSiteHeader() {
  const api = useApi()

  const { data: siteHeader } = useAsyncData<ApiSiteHeader>(
    'shop-site-header',
    async () => {
      const res = await api.get<ApiSiteHeader>('/shop/public/site-header')
      return res.data ?? {}
    },
    { server: false, lazy: true, default: () => ({}) },
  )

  return { siteHeader }
}

/** Full footer payload: menus, logo, contact, social and copyright. */
export function useSiteFooter() {
  const api = useApi()

  const { data: siteFooter } = useAsyncData<ApiSiteFooter>(
    'shop-footer',
    async () => {
      const res = await api.get<ApiSiteFooter>('/shop/public/footer')
      return res.data ?? {}
    },
    { server: false, lazy: true, default: () => ({}) },
  )

  return { siteFooter }
}
