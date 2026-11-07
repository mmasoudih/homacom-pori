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
      const res = await api.get<ApiCategory[]>('/shop/public/product-category', { skipAuth: true })
      const items = Array.isArray(res.data) ? res.data : []
      return items.length ? items.map(mapCategory) : megaCategories
    },
    {
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
      try {
        const header = await api.get<{ categories?: ApiBlogCategory[] }>('/shop/public/blog-header', { skipAuth: true })
        const headerCategories = header.data?.categories ?? []
        if (headerCategories.length)
          return headerCategories.map(mapBlogCategory)
      }
      catch {
        // Fall through to the category endpoint below.
      }

      const res = await api.get<ApiBlogCategory[]>('/shop/public/blog-category', { skipAuth: true })
      const items = Array.isArray(res.data) ? res.data : []
      return items.length ? items.map(mapBlogCategory) : blogNav
    },
    {
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

/** Brand list, falling back to the designed mock list when the API is empty. */
export function useBrands() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { data: brandItems, pending, error, refresh } = useAsyncData<BrandItem[]>(
    'shop-brands',
    async () => {
      const res = await api.get<ApiBrand[]>('/shop/brands', { skipAuth: true })
      const items = Array.isArray(res.data) ? res.data : []
      if (!items.length) return brandsPage.items

      return items.map(item => ({
        name: item.title,
        titleEn: item.title_en ?? undefined,
        logo: resolveMediaUrl(item.img, apiBase),
      }))
    },
    {
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
      const res = await api.get<ApiFaqSubject[]>('/shop/faqs', { skipAuth: true })
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
        const res = await api.get<ApiBanner[]>('/shop/banners', { skipAuth: true })
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
    { default: () => bannerSlots.value },
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
      const res = await api.get<ApiColor[]>('/shop/public/colors', { skipAuth: true })
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
    { default: () => searchColorOptions },
  )

  return { colors }
}

/** Header shell: menus, logo and phone numbers. */
export function useSiteHeader() {
  const api = useApi()

  const { data: siteHeader } = useAsyncData<ApiSiteHeader>(
    'shop-site-header',
    async () => {
      const res = await api.get<ApiSiteHeader>('/shop/public/site-header', { skipAuth: true })
      return res.data ?? {}
    },
    { default: () => ({}) },
  )

  return { siteHeader }
}

/** Full footer payload: menus, logo, contact, social and copyright. */
export function useSiteFooter() {
  const api = useApi()

  const { data: siteFooter } = useAsyncData<ApiSiteFooter>(
    'shop-footer',
    async () => {
      const res = await api.get<ApiSiteFooter>('/shop/public/footer', { skipAuth: true })
      return res.data ?? {}
    },
    { default: () => ({}) },
  )

  return { siteFooter }
}

/* -------------------------------------------------------------------------- */
/* Public about + contact pages (2026-11-03)                                   */
/* -------------------------------------------------------------------------- */

interface ApiAbout {
  about_us?: string | null
  about_us_link?: string | null
  seo_about?: string | null
}

export interface AboutContent {
  /** Rich HTML for the About Us article — render with `v-html`, never escape twice. */
  aboutUs: string
  aboutUsLink: string
  seoAbout: string
}

const EMPTY_ABOUT: AboutContent = { aboutUs: '', aboutUsLink: '', seoAbout: '' }

/**
 * About Us copy (`GET /shop/public/about`).
 *
 * Unset option keys come back as `null`, so every field is normalised to a
 * string and the page keeps its designed content until real copy exists.
 */
export function useAboutPage() {
  const api = useApi()

  const { data: about, pending, error, refresh } = useAsyncData<AboutContent>(
    'shop-public-about',
    async () => {
      try {
        const res = await api.get<ApiAbout>('/shop/public/about', { skipAuth: true })
        const row = res.data ?? {}
        return {
          aboutUs: row.about_us ?? '',
          aboutUsLink: row.about_us_link ?? '',
          seoAbout: row.seo_about ?? '',
        }
      }
      catch {
        return EMPTY_ABOUT
      }
    },
    { default: () => EMPTY_ABOUT },
  )

  return { about, pending, error, refresh }
}

/** One entry of the floating support widget (`contact_popup` array). */
export interface ContactPopupEntry {
  title: string
  /** Absolute URL, storage path or icon-font class. */
  icon: string
  link: string
  /** CMS-provided inline style (string or object). */
  style?: string | Record<string, string>
  /** CMS-provided extra classes. */
  class?: string
}

export interface ContactSocials {
  twitter: string
  telegram: string
  linkedin: string
  instagram: string
  /** The backend key keeps the `watsapp` spelling. */
  whatsapp: string
}

export interface ContactContent {
  tel: string
  mobile: string
  email: string
  address: string
  socials: ContactSocials
  popup: ContactPopupEntry[]
  popupEnabled: boolean
}

interface ApiContact {
  tel?: string | null
  mobile?: string | null
  email?: string | null
  address?: string | null
  twitter?: string | null
  telegram?: string | null
  linkedin?: string | null
  instagram?: string | null
  watsapp?: string | null
  contact_popup?: unknown
  contact_popup_status?: string | null
}

const EMPTY_CONTACT: ContactContent = {
  tel: '',
  mobile: '',
  email: '',
  address: '',
  socials: { twitter: '', telegram: '', linkedin: '', instagram: '', whatsapp: '' },
  popup: [],
  popupEnabled: false,
}

/**
 * `contact_popup` is a decoded JSON array, but a malformed or double-encoded
 * row must degrade to `[]` instead of breaking the page.
 */
function parseContactPopup(value: unknown): ContactPopupEntry[] {
  let rows: unknown = value
  if (typeof rows === 'string') {
    try {
      rows = JSON.parse(rows)
    }
    catch {
      rows = []
    }
  }
  if (!Array.isArray(rows)) return []

  return rows.flatMap((row) => {
    if (!row || typeof row !== 'object') return []

    const entry = row as Record<string, unknown>
    const title = typeof entry.title === 'string' ? entry.title : ''
    const link = typeof entry.link === 'string' ? entry.link : ''
    const icon = typeof entry.icon === 'string' ? entry.icon : ''
    if (!title && !link) return []

    const style = typeof entry.style === 'string' || (entry.style && typeof entry.style === 'object')
      ? entry.style as string | Record<string, string>
      : undefined

    return [{
      title,
      link,
      icon,
      style,
      class: typeof entry.class === 'string' ? entry.class : undefined,
    }]
  })
}

/**
 * Contact Us payload (`GET /shop/public/contact`).
 *
 * All 11 keys are always present; missing settings are `null`. The designed
 * copy is kept for labels, and `contact_popup_status` gates the widget.
 */
export function useContactPage() {
  const api = useApi()

  const { data: contact, pending, error, refresh } = useAsyncData<ContactContent>(
    'shop-public-contact',
    async () => {
      try {
        const res = await api.get<ApiContact>('/shop/public/contact', { skipAuth: true })
        const row = res.data ?? {}
        return {
          tel: row.tel ?? '',
          mobile: row.mobile ?? '',
          email: row.email ?? '',
          address: row.address ?? '',
          socials: {
            twitter: row.twitter ?? '',
            telegram: row.telegram ?? '',
            linkedin: row.linkedin ?? '',
            instagram: row.instagram ?? '',
            whatsapp: row.watsapp ?? '',
          },
          popup: parseContactPopup(row.contact_popup),
          popupEnabled: row.contact_popup_status === 'enable',
        }
      }
      catch {
        return EMPTY_CONTACT
      }
    },
    { default: () => EMPTY_CONTACT },
  )

  return { contact, pending, error, refresh }
}
