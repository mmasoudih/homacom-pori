import { DEMO_PRODUCT_ID } from './product'

export interface Category {
  title: string
  count: string
  icon: string
  accent?: boolean
}

export interface Product {
  id?: string | number
  image: string
  title: string
  price: string
  oldPrice?: string
  discount?: string
  colors?: string[]
  /** Optional discount expiry used to render a live countdown. */
  discountExpiresAt?: string | Date
}

export interface OfferCard {
  image: string
}

export const headerNav = [
  { label: 'خرید اقساطی', icon: 'coins', href: '#' },
  { label: 'پنل همکار و سازمانی', icon: 'user-check', href: '#' },
  { label: 'خرید حضوری', icon: 'store', href: '#' },
  { label: 'دسته بندی محصولات', icon: 'grid', href: '#categories' },
]

export const categories: Category[] = [
  { title: 'گوشی موبایل', count: '150', icon: 'mobile' },
  { title: 'لپ‌تاپ و  تبلت', count: '150', icon: 'laptop' },
  { title: 'ساعت هوشمند', count: '150', icon: 'watch', accent: true },
  { title: 'هدفون و هندزفری', count: '150', icon: 'headphones' },
  { title: 'کنسول بازی', count: '150', icon: 'gamepad' },
  { title: 'کامپیوتر', count: '150', icon: 'display' },
  { title: 'لوازم جانبی', count: '150', icon: 'usb' },
  { title: 'صوتی تصویری', count: '150', icon: 'speakers' },
]

const SAMSUNG_TITLE =
  'گوشی موبایل سامسونگ مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت'

const swatchSets = {
  samsung: ['#56dd1c', '#68a1d5', '#ffffff'],
  headset: ['#ff8800', '#5d5dff', '#ebc8cb'],
  laptop: ['#1d1d1f', '#ffffff'],
  headset2: ['#ef233c', '#5d5dff'],
  watch: ['#a4b7c8', '#ff8800'],
} satisfies Record<string, string[]>

const IMG = {
  samsung: '/figma/fill-ff65a9033ba49cd4.png',
  headset: '/figma/fill-bcf7fdbe4840c6f2.png',
  laptop: '/figma/fill-6df25cd971d272b0.png',
  headset2: '/figma/fill-a3b65327303691bb.png',
  watch: '/figma/fill-c06409733faa2563.png',
  laptop2: '/figma/fill-f9dec0064052dff9.png',
  laptop3: '/figma/fill-faa4a8621953f105.png',
  phone2: '/figma/fill-e393cbb3afd42faa.png',
  phone3: '/figma/fill-eedc0bf76b5dc7cd.png',
  p39: '/figma/fill-603959b7e3e05165.png',
}

const hoursFromNow = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000)

const makeAffProduct = (image: string, colors: string[]): Product => ({
  id: DEMO_PRODUCT_ID,
  image,
  title: SAMSUNG_TITLE,
  price: '87,000,000',
  oldPrice: '92,000,000',
  discount: '%30',
  colors,
  discountExpiresAt: hoursFromNow(4),
})

export const homaAffProducts: Product[] = [
  makeAffProduct(IMG.watch, swatchSets.watch),
  makeAffProduct(IMG.headset2, swatchSets.headset2),
  makeAffProduct(IMG.laptop, swatchSets.laptop),
  makeAffProduct(IMG.headset, swatchSets.headset),
  makeAffProduct(IMG.samsung, swatchSets.samsung),
]

export const banners2 = [
  { image: '/figma/fill-e44e4b8ead1c759d.png', alt: 'بنر هماکام', href: '#' },
  { image: '/figma/fill-07e29b135a3cb6e8.png', alt: 'بنر هماکام', href: '#' },
]

export const newestProducts: Product[] = [
  { id: DEMO_PRODUCT_ID, image: IMG.watch, title: SAMSUNG_TITLE, price: '87,000,000', oldPrice: '92,000,000', discount: '%30', colors: swatchSets.watch },
  { id: DEMO_PRODUCT_ID, image: IMG.headset2, title: SAMSUNG_TITLE, price: '87,000,000', oldPrice: '92,000,000', discount: '%30', colors: swatchSets.headset2 },
  { id: DEMO_PRODUCT_ID, image: IMG.laptop, title: SAMSUNG_TITLE, price: '87,000,000', colors: swatchSets.laptop },
  { id: DEMO_PRODUCT_ID, image: IMG.headset, title: SAMSUNG_TITLE, price: '87,000,000', colors: swatchSets.headset },
  { id: DEMO_PRODUCT_ID, image: IMG.samsung, title: SAMSUNG_TITLE, price: '87,000,000', oldPrice: '92,000,000', discount: '%30', colors: swatchSets.samsung },
]

export const stripBanner = {
  image: '/figma/fill-b57f0152df1c2d25.png',
  alt: 'پیشنهاد ویژه هماکام',
  href: '#',
}

const LAPTOP_TITLE =
  'لپ‌تاپ لنوو مدل IdeaPad Slim 3 15IRU8 با پردازنده Core i3-1315U، رم LPDDR5 8GB با فرکانس 2400MHz'

export const bestOfCategories = [
  {
    category: 'گوشی موبایل',
    items: [
      { id: DEMO_PRODUCT_ID, image: IMG.watch, title: SAMSUNG_TITLE, price: '92,000,000' },
      { id: DEMO_PRODUCT_ID, image: IMG.phone2, title: SAMSUNG_TITLE, price: '92,000,000' },
      { id: DEMO_PRODUCT_ID, image: IMG.phone3, title: SAMSUNG_TITLE, price: '92,000,000' },
    ],
  },
  {
    category: 'لپ‌تاپ',
    items: [
      { id: DEMO_PRODUCT_ID, image: IMG.laptop, title: LAPTOP_TITLE, price: '92,000,000' },
      { id: DEMO_PRODUCT_ID, image: IMG.laptop2, title: LAPTOP_TITLE, price: '84,000,000', oldPrice: '92,000,000', discount: '%30' },
      { id: DEMO_PRODUCT_ID, image: IMG.laptop3, title: LAPTOP_TITLE, price: '92,000,000' },
    ],
  },
  {
    category: 'هدفون و هندزفری',
    items: [
      { id: DEMO_PRODUCT_ID, image: IMG.headset, title: 'هدفون بیت مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت', price: '84,000,000', oldPrice: '92,000,000', discount: '%30' },
      { id: DEMO_PRODUCT_ID, image: IMG.p39, title: 'هدفون بلوتوثی مدل P39 کد 2021', price: '92,000,000' },
      { id: DEMO_PRODUCT_ID, image: IMG.headset2, title: 'هدفون بیت مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت', price: '92,000,000' },
    ],
  },
] as Array<{ category: string; items: Array<{ id?: string; image: string; title: string; price: string; oldPrice?: string; discount?: string }> }>

export const banners4 = [
  { image: '/figma/fill-b65ebd18e4d5d2f9.png', alt: 'بنر هماکام', href: '#' },
  { image: '/figma/fill-e4d8a4e475bb2dd8.png', alt: 'بنر هماکام', href: '#' },
  { image: '/figma/fill-e2020cdafb96743f.png', alt: 'بنر هماکام', href: '#' },
  { image: '/figma/fill-9eca5bf432eebd3d.png', alt: 'بنر هماکام', href: '#' },
]

export const bestsellerFilters = {
  prices: ['بیشتر از 200 میلیون', 'تا 200 میلیون', 'تا 100 میلیون'],
  activePrice: 'تا 100 میلیون',
  cats: [
    { label: 'لپ‌تاپ', icon: 'laptop' },
    { label: 'گوشی موبایل', icon: 'mobile' },
    { label: 'همه', icon: 'grid' },
  ],
  activeCat: 'همه',
}

export const bestsellerProducts: Product[] = [...newestProducts]

export const offersGridRows: OfferCard[][] = [
  [
    { image: IMG.phone2 },
    { image: IMG.samsung },
    { image: IMG.headset2 },
    { image: IMG.laptop },
    { image: IMG.p39 },
    { image: IMG.headset },
  ],
  [
    { image: IMG.laptop },
    { image: IMG.headset2 },
    { image: IMG.watch },
    { image: IMG.samsung },
    { image: IMG.phone2 },
    { image: IMG.laptop },
  ],
]

export const offersMeta: Record<number, { hasOld: boolean }> = {
  0: { hasOld: true },
  1: { hasOld: true },
  2: { hasOld: true },
  3: { hasOld: true },
  4: { hasOld: false },
  5: { hasOld: false },
  6: { hasOld: true },
  7: { hasOld: true },
  8: { hasOld: true },
  9: { hasOld: true },
  10: { hasOld: true },
  11: { hasOld: true },
}

export const banners3 = [
  { image: '/figma/fill-b65ebd18e4d5d2f9.png', alt: 'بنر هماکام', href: '#' },
  { image: '/figma/fill-e2020cdafb96743f.png', alt: 'بنر هماکام', href: '#' },
  { image: '/figma/fill-9eca5bf432eebd3d.png', alt: 'بنر هماکام', href: '#' },
]

export const brands = [
  { name: 'سامسونگ', logo: '/figma/fill-dcd412f6c6b6f421.png' },
  { name: 'آیفون', logo: '/figma/fill-992d28edc3940fa5.png' },
  { name: 'هواوی', logo: '/figma/fill-b5f902be6c71b296.png' },
  { name: 'ایسوز', logo: '/figma/fill-3e9cc2e18da82766.png' },
  { name: 'هواوی', logo: '/figma/fill-b5f902be6c71b296.png' },
  { name: 'سونی', logo: '/figma/fill-081e1f369576caeb.png' },
  { name: 'ایسوز', logo: '/figma/fill-3e9cc2e18da82766.png' },
  { name: 'نوکیا', logo: '/figma/fill-357771ff5878e70b.png' },
  { name: 'سونی', logo: '/figma/fill-081e1f369576caeb.png' },
]

export const blogPosts = [
  {
    image: '/figma/fill-b124df30fa8cf547.png',
    title: 'نکات مخفی تریلر دوم Spider-Man: Brand New Day | به‌وقت درماندگی مرد عنکبوتی',
    date: '28 تیر 1405',
  },
  {
    image: '/figma/fill-c57c00bcebcde686.png',
    title: 'رقابت گراک ۴٫۵ با قدرتمندترین هوش مصنوعی آنتروپیک از فردا آغاز می‌شود',
    date: '28 تیر 1405',
  },
  {
    image: '/figma/fill-d1bb52e8eb9b1170.png',
    title: 'مدیران هوش مصنوعی چینی دیپ‌سیک به تولید تراشه اختصاصی فکر می‌کنند',
    date: '28 تیر 1405',
  },
  {
    image: '/figma/fill-4d6a2b88b8435072.png',
    title: 'قیمت و رنگ‌بندی ساعت پیکسل واچ ۵ گوگل لو رفت',
    date: '28 تیر 1405',
  },
]

export const ceoSection = {
  title: 'فروشگاه اینترنتی هماکام',
  body:
    ' مرجعی بزرگ و معتبر برای خرید انواع لوازم دیجیتال و غیردیجیتال مورد نیاز شماست. با ورود به فروشگاه آنلاین هماکام، کلیه لوازم مورد نیاز خود نظیر گجت‌ها، موبایل و لپ تاپ، لوازم خانگی برقی و غیربرقی، سکه و طلا، زیبایی و سلامت، ابزارآلات و تجهیزات، لوازم ورزش و سفر و کتاب و نوشت افزار را تهیه کنید.',
}

export const footerData = {
  phones: ['0939-3206066', '0121-3250789'],
  email: 'Homacom@info.mail',
  address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، کوچه یاس، پلاک ۲۴، واحد ۵',
  badges: [
    { image: '/figma/fill-21757fcfc3f052b8.png', alt: 'نماد اعتماد' },
    { image: '/figma/fill-2136701c36483883.png', alt: 'ایتماد الکترونیکی' },
    { image: '/figma/fill-01a97078534b73a5.png', alt: 'ساماندگی' },
  ],
  columns: [
    {
      title: 'دسترسی سریع',
      links: ['صفحه اصلی', 'وبلاگ', 'خرید اقساطی', 'تماس با ما', 'درباره ما', 'برندها'],
    },
    {
      title: 'راهنمای مشتریان',
      links: ['همکاری با ما', 'سوالات متداول', 'شرایط و مقررات', 'راهنمای گارانتی', 'مجوزها', 'فروش حضوری'],
    },
    {
      title: 'لینک‌های پربازدید',
      links: ['خرید لپ‌تاپ', 'خرید گوشی موبایل', 'خرید هندزفری', 'خرید پلی استیشن ۵', 'خرید تبلت', 'خرید آیفون'],
    },
  ],
  about:
    'شرکت بازرگانی کهن تجارت کنگان با نام تجاری هماکام (HomaCom)، یک مجموعه تخصصی در حوزه فروش و توزیع محصولات الکترونیکی است. هماکام فعالیت خود را در بازار آنلاین از تابستان ۱۴۰۱ آغاز کرد و در مدت کوتاهی توانست جایگاهی ارزشمند در میان مشتریان و همکاران حوزه دیجیتال به دست آورد.',
  copyright: '© تمامی حقوق مادی و معنوی برای هماکام محفوظ است.',
}
