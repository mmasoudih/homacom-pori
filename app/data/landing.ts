export interface NavLink {
  label: string
  href: string
}

export interface Category {
  id: number
  title: string
  count: number
  icon: string
  color: string
}

export interface Product {
  id: number
  title: string
  image: string
  price: number
  oldPrice?: number
  discount?: number
  rating: number
  inStock: string
}

export interface BlogPost {
  id: number
  title: string
  date: string
  image: string
  category: string
}

export const headerNavLinks: NavLink[] = [
  { label: 'دسته بندی محصولات', href: '#categories' },
  { label: 'خرید حضوری', href: '#contact' },
  { label: 'پنل همکار و سازمانی', href: '#' },
  { label: 'خرید اقساطی', href: '#offers' },
]

export const categories: Category[] = [
  { id: 1, title: 'هدفون و هندزفری', count: 150, icon: 'headphones', color: '#ef233c' },
  { id: 2, title: 'ساعت هوشمند', count: 93, icon: 'watch', color: '#ef233c' },
  { id: 3, title: 'لپ‌تاپ و تبلت', count: 120, icon: 'laptop', color: '#ef233c' },
  { id: 4, title: 'گوشی موبایل', count: 87, icon: 'smartphone', color: '#ef233c' },
  { id: 5, title: 'صوتی تصویری', count: 64, icon: 'speaker', color: '#ef233c' },
  { id: 6, title: 'لوازم جانبی', count: 210, color: '#ef233c', icon: 'headphones' },
  { id: 7, title: 'کامپیوتر', count: 48, icon: 'monitor', color: '#ef233c' },
  { id: 8, title: 'کنسول بازی', count: 32, icon: 'gamepad', color: '#ef233c' },
]

export const products: Product[] = [
  {
    id: 1,
    title: 'گوشی موبایل سامسونگ مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت',
    image: '/figma/fill-ff65a9033ba49cd4.png',
    price: 10500000,
    oldPrice: 11800000,
    discount: 11,
    rating: 4.5,
    inStock: 'محصول موجود است',
  },
  {
    id: 2,
    title: 'هدفون بلوتوثی شیائوم مدل P39 کد 2021',
    image: '/figma/fill-bcf7fdbe4840c6f2.png',
    price: 2450000,
    oldPrice: 2850000,
    discount: 14,
    rating: 4,
    inStock: 'محصول موجود است',
  },
  {
    id: 3,
    title: 'لپ‌تاپ لنوو مدل IdeaPad Slim 3 15IRU8 با پردازنده Core i3-1315U، رم 8 گیگابایت',
    image: '/figma/fill-6df25cd971d272b0.png',
    price: 238000000,
    oldPrice: 248000000,
    discount: 5,
    rating: 5,
    inStock: 'محصول موجود است',
  },
  {
    id: 4,
    title: 'هدفون بیت مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت',
    image: '/figma/fill-a3b65327303691bb.png',
    price: 6200000,
    oldPrice: 6900000,
    discount: 10,
    rating: 4.5,
    inStock: 'محصول موجود است',
  },
  {
    id: 5,
    title: 'ساعت هوشمند سامسونگ مدل Galaxy Watch 6 اسمال',
    image: '/figma/fill-c06409733faa2563.png',
    price: 18900000,
    oldPrice: 21900000,
    discount: 14,
    rating: 5,
    inStock: 'تنها ۲ عدد در انبار',
  },
  {
    id: 6,
    title: 'گوشی موبایل شیائومی ردمی نوت ۱۳ پرو ظرفیت ۲۵۶ گیگابایت',
    image: '/figma/fill-899574ec5867c977.png',
    price: 21450000,
    oldPrice: 22900000,
    discount: 6,
    rating: 4.5,
    inStock: 'محصول موجود است',
  },
  {
    id: 7,
    title: 'هدفون بلوتوثی سونی مدل WH-1000XM5',
    image: '/figma/fill-301c06457d3982e5.png',
    price: 38500000,
    oldPrice: 40500000,
    discount: 5,
    rating: 5,
    inStock: 'محصول موجود است',
  },
  {
    id: 8,
    title: 'اسپیکر بلوتوثی جی‌بی‌ال مدل Charge 5',
    image: '/figma/fill-52d72a01d4f5052e.png',
    price: 14800000,
    oldPrice: 16200000,
    discount: 9,
    rating: 4,
    inStock: 'محصول موجود است',
  },
  {
    id: 9,
    title: 'کنسول بازی سونی پلی استیشن ۵ اسلیم',
    image: '/figma/fill-2136701c36483883.png',
    price: 46500000,
    oldPrice: 48500000,
    discount: 5,
    rating: 5,
    inStock: 'محصول موجود است',
  },
  {
    id: 10,
    title: 'گوشی موبایل اپل مدل iPhone 15 Pro Max ظرفیت 256GB',
    image: '/figma/fill-6df25cd971d272b0.png',
    price: 289000000,
    oldPrice: 305000000,
    discount: 6,
    rating: 5,
    inStock: 'محصول موجود است',
  },
]

export const bannerImages = {
  hero: '/figma/fill-fc0d272a9ceafa5f.png',
  bannerOne: '/figma/fill-07e29b135a3cb6e8.png',
  bannerTwo: '/figma/fill-e44e4b8ead1c759d.png',
}

export const brands: string[] = [
  'سامسونگ',
  'آیفون',
  'هواوی',
  'ایسوز',
  'نوکیا',
  'شیائومی',
  'سونی',
  'اپل',
  'ال‌جی',
  'های‌سنس',
]

export const priceTabs = [
  { id: 'all', label: 'همه' },
  { id: 'over-200', label: 'بیشتر از ۲۰۰ میلیون' },
  { id: 'up-200', label: 'تا ۲۰۰ میلیون' },
  { id: 'up-100', label: 'تا ۱۰۰ میلیون' },
]

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'قیمت و رنگ‌بندی ساعت پیکسل واچ ۵ گوگل لو رفت',
    date: '28 تیر 1405',
    category: 'وبلاگ',
    image: '/figma/fill-464a641df08d34f1.png',
  },
  {
    id: 2,
    title: 'مدیران هوش مصنوعی چینی دیپ‌سیک به تولید تراشه اختصاصی فکر می‌کنند',
    date: '27 تیر 1405',
    category: 'وبلاگ',
    image: '/figma/fill-5db09d93bf7473ad.png',
  },
  {
    id: 3,
    title: 'نکات مخفی تریلر دوم Spider-Man با وقفه درماندگی مرد عنکبوتی',
    date: '26 تیر 1405',
    category: 'وبلاگ',
    image: '/figma/fill-4883c6354fb8fcbe.png',
  },
]

export const footerLinks = {
  quickAccess: [
    { label: 'صفحه اصلی', href: '#' },
    { label: 'درباره ما', href: '#' },
    { label: 'تماس با ما', href: '#' },
    { label: 'خرید اقساطی', href: '#' },
    { href: '#', label: 'برندها' },
  ],
  customerGuide: [
    { label: 'فروش حضوری', href: '#' },
    { label: 'مجوزها', href: '#' },
    { label: 'راهنمای گارانتی', href: '#' },
    { label: 'شرایط و مقررات', href: '#' },
    { label: 'سوالات متداول', href: '#' },
    { label: 'همکاری با ما', href: '#' },
  ],
  popularLinks: [
    { label: 'خرید آیفون', href: '#' },
    { label: 'خرید تبلت', href: '#' },
    { label: 'خرید پلی استیشن ۵', href: '#' },
    { label: 'خرید هندزفری', href: '#' },
    { label: 'خرید گوشی موبایل', href: '#' },
    { label: 'خرید لپ‌تاپ', href: '#' },
  ],
}
