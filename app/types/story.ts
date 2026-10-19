export interface StoryItem {
  id?: number | string
  title: string
  subtitle?: string
  /** Large media shown in the viewer (image or video URL). */
  image: string
  /** Small square shown in the header strip. Falls back to `image`. */
  thumbnail?: string
  href?: string
  badge?: string
  type?: 'image' | 'video'
  /** Emphasise the first/branded circle in the header strip. */
  accent?: boolean
}

/** Shape returned by `GET /api/shop/stories`. */
export interface StoryApiItem {
  id: number
  thumbnail?: string | null
  image?: string | null
  text?: string | null
  link?: string | null
  target?: string | null
}

export function isVideoStory(url?: string | null): boolean {
  return !!url && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
}
