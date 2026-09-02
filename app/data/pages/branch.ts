export interface BranchInfo {
  id: string
  name: string
  hours: string
  addressLabel: string
  address: string
  phone: string
  images: string[]
}

export const branches: BranchInfo[] = [
  {
    id: 'branch-1',
    name: 'شعبه اول',
    hours: 'ساعت کاری شعبه: یکشنبه تا چهارشنبه از ۹:۰۰ الی ۲۳:۰۰',
    addressLabel: 'آدرس شعبه اول:',
    address: 'تهران، خیابان وحدت اسلامی، نبش کوچه چیت‌سازی، پلاک ۳۶۵',
    phone: '۰۲۱-۳۲۵۰۷۸۹',
    images: [
      '/assets/branches/branch-1.jpg',
      '/assets/branches/branch-2.jpg',
      '/assets/branches/branch-1.jpg',
      '/assets/branches/branch-2.jpg',
    ],
  },
  {
    id: 'branch-2',
    name: 'شعبه دوم',
    hours: 'ساعت کاری شعبه: شنبه تا چهارشنبه از ۱۰:۰۰ الی ۲۱:۰۰',
    addressLabel: 'آدرس شعبه دوم:',
    address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، کوچه یاس، پلاک ۲۴، واحد ۵',
    phone: '۰۲۱-۳۳۵۰۷۲۹۸',
    images: [
      '/assets/branches/branch-2.jpg',
      '/assets/branches/branch-1.jpg',
      '/assets/branches/branch-2.jpg',
      '/assets/branches/branch-1.jpg',
    ],
  },
]

export const branchPage = {
  title: 'راهنمای آنلاین',
  subtitle: 'فروشگاه‌های حضوری هماکام در سراسر تهران آماده پذیرایی از شما هستند',
  tabs: ['راهنمای آنلاین', 'راهنمای خرید', 'امکانات فروشگاه', 'شعبات آنلاین', 'فروشگاه‌های حضوری هماکام'],
  sectionTitle: 'فروشگاه‌های حضوری هماکام',
  intro:
    'برای تجربه‌ای نزدیک‌تر و آشنایی با محصولات، به فروشگاه‌های حضوری هماکام مراجعه کنید. کارشناسان ما در محل، شما را در انتخاب بهترین محصول راهنمایی می‌کنند.',
  branches,
}