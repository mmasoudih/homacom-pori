import type { CommentStatus, MyComment, PendingComment } from '~/data/comments'
import { resolveMediaUrl } from '~/utils/media'

interface ApiUserComment {
  id: number
  title?: string | null
  comment_title?: string | null
  content: string
  score?: number | null
  status?: string | null
  related_title?: string | null
  related_img?: string | null
  created_at?: string | null
  nickname?: string | null
}

const FALLBACK_IMAGE = '/figma/fill-e393cbb3afd42faa.png'

function mapStatus(status?: string | null): CommentStatus {
  if (status === 'rejected') return 'rejected'
  if (status === 'pending') return 'pending'
  return 'approved'
}

function formatDate(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(date)
}

/** Authenticated user's comments (approved/mine + pending tabs). */
export function useUserComments() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const mine = ref<MyComment[]>([])
  const pending = ref<PendingComment[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    loading.value = true
    try {
      const res = await api.get<ApiUserComment[]>('/shop/user/comments', {
        query: { 'filters[per_page]': 100 },
      })
      const comments = res.data ?? []

      mine.value = comments
        .filter(comment => mapStatus(comment.status) !== 'pending')
        .map<MyComment>(comment => ({
          id: String(comment.id),
          title: comment.related_title ?? comment.title ?? comment.comment_title ?? '',
          image: resolveMediaUrl(comment.related_img, apiBase) || FALLBACK_IMAGE,
          date: formatDate(comment.created_at),
          rating: Number(comment.score) || 0,
          text: comment.content,
          status: mapStatus(comment.status),
          likes: 0,
          dislikes: 0,
        }))

      pending.value = comments
        .filter(comment => mapStatus(comment.status) === 'pending')
        .map<PendingComment>(comment => ({
          id: String(comment.id),
          title: comment.related_title ?? comment.title ?? comment.comment_title ?? '',
          image: resolveMediaUrl(comment.related_img, apiBase) || FALLBACK_IMAGE,
          mood: null,
        }))

      loaded.value = true
    }
    finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    await api.del(`/shop/user/comments/${encodeURIComponent(id)}`)
    mine.value = mine.value.filter(comment => comment.id !== id)
    pending.value = pending.value.filter(comment => comment.id !== id)
  }

  return { mine, pending, loading, loaded, load, remove }
}
