import { toPersianDigits } from '~/utils/format'

export interface LegalInfo {
  organizationName: string
  nationalId: string
  registrationId: string
  phone: string
  city: string
  province: string
  postalAddress: string
  /** Backend ids used by `PUT /shop/user/profile/legal-information`. */
  stateId?: number
  cityId?: number
  /** Gregorian `YYYY-MM-DD` (`company_establishment_date`). */
  establishmentDate?: string
  /** Required by the legal-information endpoint. */
  economicCode?: string
  ceo?: string
}

export interface AccountProfile {
  firstName: string
  lastName: string
  /** Relative or absolute avatar URL from the profile payload. */
  avatar?: string
  mobile: string
  nickname: string
  username: string
  /** Wallet/credit balance returned by `profile/me`. */
  credit: number
  /** Currency code (`IRT`). */
  currency: string
  birthYear: string
  birthMonth: string
  birthDay: string
  /** Ready-to-render `۱۳۷۴/۰۲/۲۶`. */
  birthDate: string
  /** Empty string means "not set" (renders the red + add action). */
  nationalId: string
  email: string
  cardNumber: string
  shebaNumber: string
  /** `null` until the legal (organization) form is submitted. */
  legal: LegalInfo | null
  hasPassword: boolean
}

export const accountProfile: AccountProfile = {
  firstName: 'پوریا',
  lastName: 'قنبری',
  mobile: '',
  nickname: '',
  username: '',
  credit: 0,
  currency: 'IRT',
  birthYear: '۱۳۷۴',
  birthMonth: '۰۲',
  birthDay: '۲۶',
  birthDate: '۱۳۷۴/۰۲/۲۶',
  nationalId: '',
  email: 'mohammadghVFA8@gmail.com',
  cardNumber: '۵۸۵۹۴۷۱۰۲۳۱۴۶۰۸',
  shebaNumber: '۵۸۵۹۴۷۱۰۲۳۱۴۶۰۸',
  legal: null,
  hasPassword: false,
}

export interface SelectOption {
  value: string
  label: string
}

const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
]

/** Year range offered in the birthdate dialog (newest first). */
export const birthYears: SelectOption[] = Array.from(
  { length: 26 },
  (_, i) => toPersianDigits(1385 - i),
).map(value => ({ value, label: value }))

export const birthMonths: SelectOption[] = PERSIAN_MONTHS.map((label, i) => ({
  value: toPersianDigits(String(i + 1).padStart(2, '0')),
  label,
}))

export const birthDays: SelectOption[] = Array.from(
  { length: 31 },
  (_, i) => toPersianDigits(String(i + 1).padStart(2, '0')),
).map(value => ({ value, label: value }))

export const provinces: SelectOption[] = [
  'تهران',
  'اصفهان',
  'فارس',
  'خراسان رضوی',
  'آذربایجان شرقی',
  'البرز',
  'گیلان',
].map(name => ({ value: name, label: name }))

const CITY_NAMES: Record<string, string[]> = {
  'تهران': ['تهران', 'اسلامشهر', 'شهریار', 'ورامین', 'رباط‌کریم'],
  'اصفهان': ['اصفهان', 'کاشان', 'نجف‌آباد', 'خمینی‌شهر'],
  'فارس': ['شیراز', 'مرودشت', 'کازرون', 'جهرم'],
  'خراسان رضوی': ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه'],
  'آذربایجان شرقی': ['تبریز', 'مراغه', 'مرند', 'اهر'],
  'البرز': ['کرج', 'فردیس', 'نظرآباد', 'هشتگرد'],
  'گیلان': ['رشت', 'انزلی', 'لاهیجان', 'آستارا'],
}

export const citiesByProvince: Record<string, SelectOption[]> = Object.fromEntries(
  Object.entries(CITY_NAMES).map(([province, cities]) => [
    province,
    cities.map(name => ({ value: name, label: name })),
  ]),
)

/** `۱۳۷۴/۰۲/۲۶` from the three selected parts. */
export function formatBirthDate(year: string, month: string, day: string): string {
  return [year, month, day].filter(Boolean).join('/')
}
