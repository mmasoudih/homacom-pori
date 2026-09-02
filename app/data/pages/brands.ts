export interface BrandItem {
  name: string
  logo: string
}

const LOGOS = {
  samsung: '/figma/fill-dcd412f6c6b6f421.png',
  apple: '/figma/fill-992d28edc3940fa5.png',
  huawei: '/figma/fill-b5f902be6c71b296.png',
  asus: '/figma/fill-3e9cc2e18da82766.png',
  sony: '/figma/fill-081e1f369576caeb.png',
  nokia: '/figma/fill-357771ff5878e70b.png',
}

const base: BrandItem[] = [
  { name: 'سامسونگ', logo: LOGOS.samsung },
  { name: 'اپل', logo: LOGOS.apple },
  { name: 'هواوی', logo: LOGOS.huawei },
  { name: 'ایسوز', logo: LOGOS.asus },
  { name: 'سونی', logo: LOGOS.sony },
  { name: 'نوکیا', logo: LOGOS.nokia },
]

/** 40 cards = 8 columns × 5 rows on desktop. */
export const brands: BrandItem[] = Array.from({ length: 40 }, (_, i) => base[i % base.length])

export const brandsPage = {
  title: 'برندها',
  subtitle: 'خرید مطمئن از نام‌هایی که می‌شناسید و به آن‌ها اعتماد دارید.',
  searchPlaceholder: 'جستجو در برندها ...',
  items: brands,
}