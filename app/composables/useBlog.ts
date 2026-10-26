import type { BlogArticle, BlogBlock, BlogComment, BlogPost, BlogSection } from '~/data/blog'
import {
  blogArticle as mockArticle,
  blogArticleSidebar,
  blogHeroFeatured,
  blogHeroRow,
  blogHeroSlides,
  blogPosts as mockPosts,
  blogSections as mockSections,
  findBlogCategory,
  postsByCategory,
} from '~/data/blog'
import { ApiError } from '~/composables/useApi'
import { toPersianDigits } from '~/utils/format'
import { resolveMediaUrl } from '~/utils/media'

interface ApiBlogCategoryRef {
  id: number
  title: string
  slug: string
}

interface ApiBlogPost {
  id: number
  title: string
  slug: string
  content?: string | null
  summary?: string | null
  excerpt?: string | null
  img?: string | null
  thumbnail?: string | null
  view?: number | null
  /** Decorative admin value, not a score (0–9 in the wild). */
  star?: number | null
  /** Cached SUM of approved-comment scores; may be stale/null. */
  total_rating?: number | null
  /** Derived 0–5 mean score of approved comments; null when unrated. */
  rate?: number | null
  comment_status?: string | null
  published_at?: string | null
  created_at?: string | null
  author_nickname?: string | null
  categories?: ApiBlogCategoryRef[]
}

interface ApiBlogComment {
  id: number
  content: string
  score?: number | null
  status?: string | null
  nickname?: string | null
  created_at?: string | null
  strength?: string[]
  weakness?: string[]
  user?: { nickname?: string | null } | null
}

interface ApiBlogHome {
  lastPosts?: ApiBlogPost[]
  categories?: Array<ApiBlogCategoryRef & { posts?: ApiBlogPost[] }>
}

interface ApiBlogDetail {
  post: ApiBlogPost
  latest?: ApiBlogPost[]
  most_viewer?: ApiBlogPost[]
}

interface ApiBlogCollection {
  items: ApiBlogPost[]
  pagination: {
    total: number
    count: number
    per_page: number
    current_page: number
    last_page: number
    has_more_pages: boolean
  }
}

const FALLBACK_IMAGE = '/figma/fill-b124df30fa8cf547.png'

export interface BlogHome {
  sections: BlogSection[]
  hero: { featured: BlogPost, slides: BlogPost[], row: BlogPost[] }
  allPosts: BlogPost[]
}

function formatDate(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(date)
}

function relativeAge(value?: string | null): string {
  if (!value) return ''
  const time = new Date(value).getTime()
  if (Number.isNaN(time)) return ''

  const days = Math.floor((Date.now() - time) / 86_400_000)
  if (days <= 0) return 'امروز'
  if (days < 30) return `${toPersianDigits(days)} روز پیش`
  if (days < 365) return `${toPersianDigits(Math.floor(days / 30))} ماه پیش`
  return `${toPersianDigits(Math.floor(days / 365))} سال پیش`
}

function mapBlogComment(comment: ApiBlogComment): BlogComment {
  const score = Number(comment.score) || 0
  return {
    id: String(comment.id),
    author: comment.nickname || comment.user?.nickname || 'کاربر هماکام',
    date: formatDate(comment.created_at),
    text: comment.content,
    pending: comment.status === 'pending',
    rating: score >= 1 && score <= 5 ? score : undefined,
    pros: comment.strength?.length ? comment.strength : undefined,
    cons: comment.weakness?.length ? comment.weakness : undefined,
  }
}

function mapPost(post: ApiBlogPost, apiBase: string): BlogPost {
  const category = post.categories?.[0]
  return {
    slug: post.slug,
    title: post.title,
    image: resolveMediaUrl(post.img || post.thumbnail, apiBase) || FALLBACK_IMAGE,
    date: formatDate(post.published_at || post.created_at),
    age: relativeAge(post.published_at || post.created_at),
    category: category?.title ?? '',
    categorySlug: category?.slug ?? '',
  }
}

function forceCategory(post: BlogPost, slug: string, title: string): BlogPost {
  return { ...post, categorySlug: slug, category: title }
}

function dedupe(posts: BlogPost[]): BlogPost[] {
  const seen = new Set<string>()
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)
    return true
  })
}

function fallbackHome(): BlogHome {
  return {
    sections: mockSections.map(section => ({
      ...section,
      posts: section.posts.map(post => ({ ...post })),
    })),
    hero: {
      featured: blogHeroFeatured,
      slides: blogHeroSlides,
      row: blogHeroRow,
    },
    allPosts: dedupe([
      ...mockPosts,
      ...mockSections.flatMap(section => section.posts),
    ]),
  }
}

/** Blog landing: latest posts + one section per API category. */
export function useBlogHome() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { data, pending, error, refresh } = useAsyncData<BlogHome>(
    'shop-blog-home',
    async () => {
      try {
        const res = await api.get<ApiBlogHome>('/shop/blogs', { skipAuth: true })
        const latest = (res.data?.lastPosts ?? []).map(post => mapPost(post, apiBase))
        const categories = res.data?.categories ?? []

        if (!latest.length && !categories.length)
          return fallbackHome()

        const sections: BlogSection[] = [
          { title: 'جدیدترین مقالات', categorySlug: null, posts: latest },
          ...categories.map(category => ({
            title: category.title,
            categorySlug: category.slug,
            posts: (category.posts ?? []).map(post => forceCategory(mapPost(post, apiBase), category.slug, category.title)),
          })),
        ].filter(section => section.posts.length > 0)

        const allPosts = dedupe([
          ...latest,
          ...categories.flatMap(category => (category.posts ?? []).map(post => mapPost(post, apiBase))),
        ])
        const heroPosts = latest.length ? latest : allPosts

        return {
          sections,
          hero: {
            featured: heroPosts[0] ?? blogHeroFeatured,
            slides: heroPosts.slice(0, 5).length ? heroPosts.slice(0, 5) : blogHeroSlides,
            row: heroPosts.slice(5, 8).length ? heroPosts.slice(5, 8) : blogHeroRow,
          },
          allPosts: allPosts.length ? allPosts : fallbackHome().allPosts,
        }
      }
      catch {
        return fallbackHome()
      }
    },
    { default: fallbackHome },
  )

  return { home: data, pending, error, refresh }
}

/** Category listing with pagination (mock category as fallback). */
export function useBlogCategory(slug: Ref<string>, page: Ref<number>) {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { data, pending, error, refresh } = useAsyncData(
    () => `shop-blog-category-${slug.value}-${page.value}`,
    async () => {
      try {
        const res = await api.get<ApiBlogCollection>(
          `/shop/blogs/category/${encodeURIComponent(slug.value)}`,
          { query: { 'filters[page]': page.value, 'filters[per_page]': 16 }, skipAuth: true },
        )
        const items = res.data?.items ?? []
        if (!items.length) throw new Error('empty')

        let title = items[0]?.categories?.find(category => category.slug === slug.value)?.title
        if (!title) {
          try {
            const categories = await api.get<ApiBlogCategoryRef[]>('/shop/public/blog-category', { skipAuth: true })
            title = categories.data?.find(category => category.slug === slug.value)?.title
          }
          catch {
            // Title is cosmetic — fall back to the slug below.
          }
        }

        const categoryTitle = title ?? findBlogCategory(slug.value)?.label ?? slug.value

        return {
          posts: items.map(post => forceCategory(mapPost(post, apiBase), slug.value, categoryTitle)),
          title: categoryTitle,
          lastPage: res.data?.pagination.last_page ?? 1,
        }
      }
      catch {
        const pool = postsByCategory(slug.value)
        return {
          posts: pool,
          title: findBlogCategory(slug.value)?.label ?? slug.value,
          lastPage: 1,
        }
      }
    },
    {
      watch: [slug, page],
      default: () => ({
        posts: postsByCategory(slug.value),
        title: findBlogCategory(slug.value)?.label ?? slug.value,
        lastPage: 1,
      }),
    },
  )

  return { categoryPosts: data, pending, error, refresh }
}

function parseBody(content?: string | null): BlogBlock[] {
  if (!content) return []
  const plain = content.replace(/<[^>]*>/g, '').trim()
  if (!plain) return []

  return plain
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .map<BlogBlock>((paragraph) => {
      const heading = /^#{1,4}\s+(.*)$/.exec(paragraph)
      if (heading?.[1]) return { kind: 'heading', text: heading[1] }
      return { kind: 'paragraph', segments: [{ text: paragraph }] }
    })
}

function mapArticle(post: ApiBlogPost, apiBase: string): BlogArticle {
  const category = post.categories?.[0]
  const body = parseBody(post.content)
  const lead = post.excerpt || post.summary || body.find(block => block.kind === 'paragraph')?.segments[0]?.text || ''
  const rate = post.rate != null ? Number(post.rate) : 0

  return {
    apiId: post.id,
    slug: post.slug,
    categorySlug: category?.slug ?? '',
    category: category?.title ?? '',
    title: post.title,
    image: resolveMediaUrl(post.img || post.thumbnail, apiBase) || FALLBACK_IMAGE,
    author: post.author_nickname || 'هماکام',
    date: formatDate(post.published_at || post.created_at),
    views: `${toPersianDigits(Number(post.view ?? 0))} بازدید`,
    rating: Number.isFinite(rate) ? rate : 0,
    lead,
    body,
    comments: [],
  }
}

/** Article detail + sidebar rails + related posts. */
export function useBlogPost(slug: Ref<string>, categorySlug: Ref<string>) {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { data, pending, error, refresh } = useAsyncData(
    () => `shop-blog-post-${slug.value}`,
    async () => {
      try {
        const res = await api.get<ApiBlogDetail>(`/shop/blogs/${encodeURIComponent(slug.value)}`, { skipAuth: true })
        if (!res.data?.post) throw new Error('not found')

        const article = mapArticle(res.data.post, apiBase)
        if (!article.categorySlug) article.categorySlug = categorySlug.value

        try {
          const commentsPath = `/shop/blogs/${encodeURIComponent(String(res.data.post.id))}/comments`
          const query = { 'filters[per_page]': 100 }

          // Send the bearer token so the thread includes the viewer's own
          // pending comments; retry anonymously if the token is stale.
          let comments
          try {
            comments = await api.get<ApiBlogComment[]>(commentsPath, { query })
          }
          catch (err) {
            if (err instanceof ApiError && err.status === 401)
              comments = await api.get<ApiBlogComment[]>(commentsPath, { query, skipAuth: true })
            else
              throw err
          }

          article.comments = (comments.data ?? []).map(mapBlogComment)
          article.commentsTotal = article.comments.length
        }
        catch {
          // Comments are optional — the article still renders without them.
        }

        const latest = (res.data.latest ?? []).map(post => mapPost(post, apiBase))
        const mostViewed = (res.data.most_viewer ?? []).map(post => mapPost(post, apiBase))
        const related = dedupe([...latest, ...mostViewed])
          .filter(post => post.slug !== article.slug)
          .slice(0, 4)

        return {
          article,
          sidebar: [
            { title: 'تازترین‌ها', posts: latest.slice(0, 6) },
            { title: 'پربازدیدترین‌ها', posts: mostViewed.slice(0, 6) },
          ].filter(rail => rail.posts.length > 0),
          related: related.length ? related : blogArticleSidebar[0]?.posts.slice(0, 4) ?? [],
        }
      }
      catch {
        return {
          article: mockArticle,
          sidebar: blogArticleSidebar,
          related: mockPosts.slice(0, 4),
        }
      }
    },
    {
      watch: [slug],
      default: () => ({
        article: mockArticle,
        sidebar: blogArticleSidebar,
        related: mockPosts.slice(0, 4),
      }),
    },
  )

  return { articleData: data, pending, error, refresh }
}
