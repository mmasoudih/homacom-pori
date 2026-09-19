export type TicketStatus = 'answered' | 'waiting' | 'closed'

export type TicketTone = 'emerald' | 'indigo' | 'red'

export type TicketAuthor = 'user' | 'support'

export interface TicketStatusMeta {
  label: string
  tone: TicketTone
}

export interface TicketMessage {
  id: string
  author: TicketAuthor
  body: string
  date: string
}

export interface Ticket {
  id: string
  code: string
  subject: string
  department: string
  status: TicketStatus
  date: string
  messages: TicketMessage[]
}

export interface TicketSubject {
  value: string
  label: string
}

export interface NewTicketPayload {
  subject: string
  topic: string
  description: string
  attachment: string
}

export const ticketStatusMeta: Record<TicketStatus, TicketStatusMeta> = {
  answered: { label: 'باز - پاسخ داده شده', tone: 'emerald' },
  waiting: { label: 'باز - درانتظار پاسخ', tone: 'indigo' },
  closed: { label: 'بسته شده', tone: 'red' },
}

export const ticketSubjects: TicketSubject[] = [
  { value: 'password', label: 'درخواست رمز عبور' },
  { value: 'order', label: 'پیگیری سفارش' },
  { value: 'payment', label: 'مشکل پرداخت' },
  { value: 'return', label: 'درخواست مرجوعی' },
  { value: 'technical', label: 'مشکل فنی' },
  { value: 'other', label: 'سایر موضوعات' },
]

const SUBJECT = 'درخواست رمز عبور'
const DEPARTMENT = 'بخش مالی'
const CODE = '321EAAP6-0013'
const DATE = '۱۳۹۹ دی ۱۴ - ۲۳:۴۳'

const PASSWORD_THREAD: TicketMessage[] = [
  {
    id: 'message-1',
    author: 'user',
    body: 'سلام، وقت بخیر.\nمن قصد خرید یک گوشی Galaxy S24 Ultra رو دارم.\nموقع ثبت سفارش، کد تخفیف جشنواره MOBILE2026\nرو وارد می‌کنم اما پیام خطا میده که «کد تخفیف معتبر\nنیست یا مهلت آن تمام شده است»، در حالی که روی\nبنر بالای سایت زدید تا پایان امشب اعتبارات داره.',
    date: '۱۳۹۹ دی ۱۴ - ۲۳:۴۰',
  },
  {
    id: 'message-2',
    author: 'support',
    body: 'از این‌که «موبایل کالا» را برای خرید انتخاب کردید متشکریم.',
    date: '۱۳۹۹ دی ۱۴ - ۲۳:۴۲',
  },
  {
    id: 'message-3',
    author: 'user',
    body: 'ممنونم از شما بابت وقتی که گذاشتین',
    date: '۱۳۹۹ دی ۱۴ - ۲۳:۴۳',
  },
]

export const tickets: Ticket[] = [
  { id: 'ticket-1', code: CODE, subject: SUBJECT, department: DEPARTMENT, status: 'answered', date: DATE, messages: [...PASSWORD_THREAD] },
  { id: 'ticket-2', code: CODE, subject: SUBJECT, department: DEPARTMENT, status: 'closed', date: DATE, messages: [...PASSWORD_THREAD] },
  { id: 'ticket-3', code: CODE, subject: SUBJECT, department: DEPARTMENT, status: 'waiting', date: DATE, messages: [...PASSWORD_THREAD] },
  { id: 'ticket-4', code: CODE, subject: SUBJECT, department: DEPARTMENT, status: 'closed', date: DATE, messages: [...PASSWORD_THREAD] },
  { id: 'ticket-5', code: CODE, subject: SUBJECT, department: DEPARTMENT, status: 'waiting', date: DATE, messages: [...PASSWORD_THREAD] },
  { id: 'ticket-6', code: CODE, subject: SUBJECT, department: DEPARTMENT, status: 'closed', date: DATE, messages: [...PASSWORD_THREAD] },
]

export function findTicket(id: string): Ticket | undefined {
  return tickets.find(ticket => ticket.id === id)
}
