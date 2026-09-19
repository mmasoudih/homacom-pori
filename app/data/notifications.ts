export interface AppNotification {
  id: string
  title: string
  body: string
  date: string
  unread: boolean
}

const TITLE = 'سوپریخفیف‌های امروز رو دیدی؟'
const BODY = 'تا ۸۰٪ تخفیف فروشگاه‌ها، به تعداد محدود'
const DATE = '۱۹ تیر ۱۴۰۵'

export const notifications: AppNotification[] = [
  { id: 'notification-1', title: TITLE, body: BODY, date: DATE, unread: true },
  { id: 'notification-2', title: TITLE, body: BODY, date: DATE, unread: true },
]

/** Unread count shown over the sidebar "اعلان‌ها" nav item. */
export const notificationBadgeCount = notifications.filter(item => item.unread).length
