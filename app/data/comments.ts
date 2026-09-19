export type CommentStatus = 'approved' | 'rejected' | 'pending'

export type CommentMood = 'angry' | 'sad' | 'neutral' | 'happy' | 'love'

export type CommentTabKey = 'pending' | 'mine'

export interface CommentTab {
  key: CommentTabKey
  label: string
  count: number
}

export interface MyComment {
  id: string
  title: string
  image: string
  date: string
  /** Star rating (1-5). */
  rating: number
  text: string
  status: CommentStatus
  likes: number
  dislikes: number
}

export interface PendingComment {
  id: string
  title: string
  image: string
  mood?: CommentMood | null
}

const TITLE_MINE =
  'گوشی موبایل اپل مدل iPhone 17 CH دو سیم کارت ظرفیت 256 گیگابایت و رم 8 گیگابایت - ریجستر شده و اکتیو'

const TITLE_PENDING =
  'گوشی موبایل اپل مدل iPhone 17 CH دو سیم کارت ظرفیت 256 گیگابایت و رم 8 گیگابایت - ریجیستر شده و اکتیو'

const DATE = '۱۷ مرداد ۱۴۰۵'

const BODY_HEADSET =
  'قیمت مناسبی داره . صداش هم مناسب و نگهداری شارژ ایرپاد و کیس خیلی خوبه . ولی سعی کنید کیس هفته یی بار شارژ کنین که به باطریش فشار نیاد. برام با تیپاکس قرار بود بیارن که یه هفته طول کشید انتظار داشتم زودتر بیاد. اما با این حال، با صفحه نمایش روشن‌تر، واضح‌تر و عملکرد سریع‌تر، به نظر می‌رسد و همین هم ...'

const BODY_LAPTOP =
  'برام با تیپاکس قرار بود بیارن که یه هفته طول کشید انتظار داشتم زودتر بیاد. اما با این حال، با صفحه نمایش روشن‌تر، واضح‌تر و عملکرد سریع‌تر، به نظر می‌رسد.'

const IMG = {
  pinkHeadset: '/figma/fill-bcf7fdbe4840c6f2.png',
  blackHeadset: '/figma/fill-a3b65327303691bb.png',
  purpleLaptop: '/figma/fill-6df25cd971d272b0.png',
  bluePhone: '/figma/fill-eedc0bf76b5dc7cd.png',
}

/** RTL tab order: the first entry renders at the right edge. */
export const commentTabs: CommentTab[] = [
  { key: 'pending', label: 'درانتظار دیدگاه', count: 4 },
  { key: 'mine', label: 'دیدگاه های من', count: 2 },
]

export const myComments: MyComment[] = [
  {
    id: 'comment-1',
    title: TITLE_MINE,
    image: IMG.pinkHeadset,
    date: DATE,
    rating: 4,
    text: BODY_HEADSET,
    status: 'approved',
    likes: 5,
    dislikes: 2,
  },
  {
    id: 'comment-2',
    title: TITLE_MINE,
    image: IMG.purpleLaptop,
    date: DATE,
    rating: 4,
    text: BODY_LAPTOP,
    status: 'rejected',
    likes: 5,
    dislikes: 2,
  },
  {
    id: 'comment-3',
    title: TITLE_MINE,
    image: IMG.purpleLaptop,
    date: DATE,
    rating: 4,
    text: BODY_LAPTOP,
    status: 'pending',
    likes: 5,
    dislikes: 2,
  },
]

export const pendingComments: PendingComment[] = [
  { id: 'pending-1', title: TITLE_PENDING, image: IMG.pinkHeadset, mood: null },
  { id: 'pending-2', title: TITLE_PENDING, image: IMG.blackHeadset, mood: null },
  { id: 'pending-3', title: TITLE_PENDING, image: IMG.purpleLaptop, mood: null },
  { id: 'pending-4', title: TITLE_PENDING, image: IMG.bluePhone, mood: null },
]
