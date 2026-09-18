import type { Product } from '~/utils/product'
import { DEMO_PRODUCT_ID } from './product'

export interface DashboardUser {
  name: string
  email: string
  mobile: string
}

export interface WalletInfo {
  balance: number
  minCharge: number
  maxCharge: number
}

export type OrderStatTone = 'current' | 'delivered' | 'returned'

export interface OrderStat {
  key: OrderStatTone
  label: string
  count: number
}

export type DashboardNavIcon =
  | 'dashboard'
  | 'orders'
  | 'favorites'
  | 'addresses'
  | 'comments'
  | 'notifications'
  | 'support'
  | 'account'
  | 'logout'

export interface DashboardNavItem {
  key: string
  label: string
  icon: DashboardNavIcon
  href: string
  /** Renders the item in the brand red (logout). */
  danger?: boolean
}

export const dashboardUser: DashboardUser = {
  name: 'پوریا قنبری',
  email: 'komaicom@info.com',
  mobile: '۰۹۱۲-۳۲۵۰۷۸۹',
}

export const wallet: WalletInfo = {
  balance: 450_000_000,
  minCharge: 10_000,
  maxCharge: 100_000_000,
}

/** Unread badge count shown over the header bell. */
export const unreadNotifications = 7

export const orderStats: OrderStat[] = [
  { key: 'current', label: 'سفارش‌های جاری', count: 3 },
  { key: 'delivered', label: 'تحویل داده شده', count: 15 },
  { key: 'returned', label: 'کالاهای مرجوع شده', count: 1 },
]

export const dashboardNav: DashboardNavItem[] = [
  { key: 'dashboard', label: 'داشبورد', icon: 'dashboard', href: '/dashboard' },
  { key: 'orders', label: 'سفارش‌های من', icon: 'orders', href: '/dashboard/orders' },
  { key: 'favorites', label: 'مورد علاقه‌ها', icon: 'favorites', href: '#' },
  { key: 'addresses', label: 'لیست آدرس‌ها', icon: 'addresses', href: '#' },
  { key: 'comments', label: 'دیدگاه‌های من', icon: 'comments', href: '#' },
  { key: 'notifications', label: 'اعلان‌ها', icon: 'notifications', href: '#' },
  { key: 'support', label: 'پشتیبانی', icon: 'support', href: '#' },
  { key: 'account', label: 'اطلاعات حساب کاربری', icon: 'account', href: '#' },
  { key: 'logout', label: 'خروج از حساب کاربری', icon: 'logout', href: '#', danger: true },
]

const SAMSUNG_TITLE =
  'گوشی موبایل سامسونگ مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت'

const IMG = {
  headset: '/figma/fill-bcf7fdbe4840c6f2.png',
  headset2: '/figma/fill-a3b65327303691bb.png',
  phone: '/figma/fill-e393cbb3afd42faa.png',
  phone2: '/figma/fill-eedc0bf76b5dc7cd.png',
  laptop: '/figma/fill-f9dec0064052dff9.png',
  laptop2: '/figma/fill-6df25cd971d272b0.png',
  watch: '/figma/fill-c06409733faa2563.png',
  p39: '/figma/fill-603959b7e3e05165.png',
}

export const recentlyViewed: Product[] = [
  { id: DEMO_PRODUCT_ID, image: IMG.headset, title: SAMSUNG_TITLE, price: '87,000,000', colors: ['#ff8800', '#5d5dff', '#ebc8cb'] },
  { id: DEMO_PRODUCT_ID, image: IMG.phone, title: SAMSUNG_TITLE, price: '87,000,000', oldPrice: '92,000,000', discount: '%30', colors: ['#56dd1c', '#68a1d5', '#ffffff'] },
  { id: DEMO_PRODUCT_ID, image: IMG.laptop, title: SAMSUNG_TITLE, price: '92,000,000', colors: ['#1d1d1f', '#ffffff'] },
  { id: DEMO_PRODUCT_ID, image: IMG.watch, title: SAMSUNG_TITLE, price: '84,000,000', colors: ['#a4b7c8', '#ff8800'] },
  { id: DEMO_PRODUCT_ID, image: IMG.headset2, title: SAMSUNG_TITLE, price: '87,000,000', oldPrice: '92,000,000', discount: '%30', colors: ['#ef233c', '#5d5dff'] },
  { id: DEMO_PRODUCT_ID, image: IMG.laptop2, title: SAMSUNG_TITLE, price: '92,000,000', colors: ['#1d1d1f', '#ffffff'] },
]
