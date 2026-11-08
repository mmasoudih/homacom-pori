export interface BranchInfo {
  id: string
  name: string
  hours: string
  addressLabel: string
  address: string
  phone: string
  /** Static map snapshot exported from the Figma `Branch-desktop` frame. */
  map: string
  /** Mobile crop of the same map, exported from the `Branch-mobile` frame. */
  mapMobile: string
  images: string[]
}

/** Assets exported from the `Branch-desktop` and `Branch-mobile` frames in FigCraft. */
const branchMap = '/icons/branch/map.png'
const branchMapMobile = '/icons/branch/map-mobile.png'
const branchGallery = '/icons/branch/gallery.png'

export const branches: BranchInfo[] = [
  {
    id: 'branch-1',
    name: 'شعبه اول',
    hours: 'ساعت کاری شعبه: یکشنبه تا چهارشنبه از ۹:۰۰ الی ۲۳:۰۰',
    addressLabel: 'آدرس شعبه اول:',
    address: 'تهران، خیابان وحدت اسلامی، نبش کوچه چیت‌سازی، پلاک ۳۶۵',
    phone: '۰۲۱-۳۲۵۰۷۸۹',
    map: branchMap,
    mapMobile: branchMapMobile,
    images: [branchGallery, branchGallery, branchGallery, branchGallery],
  },
  {
    id: 'branch-2',
    name: 'شعبه دوم',
    hours: 'ساعت کاری شعبه: شنبه تا چهارشنبه از ۱۰:۰۰ الی ۲۱:۰۰',
    addressLabel: 'آدرس شعبه دوم:',
    address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، کوچه یاس، پلاک ۲۴، واحد ۵',
    phone: '۰۲۱-۳۳۵۰۷۲۹۸',
    map: branchMap,
    mapMobile: branchMapMobile,
    images: [branchGallery, branchGallery, branchGallery, branchGallery],
  },
]

export const branchPage = {
  title: 'راهنمای آنلاین',
  subtitle: 'فروشگاه‌های حضوری هماکام در سراسر تهران آماده پذیرایی از شما هستند',
  tabs: ['راهنمای گارانتی', 'راهنمای خرید', 'فروشگاه‌های حضوری هماکام', 'مرجوعی کالا', 'راهنمای ثبت نام'],
  sectionTitle: 'فروشگاه‌های حضوری هماکام',
  intro:
    'برای تجربه‌ای نزدیک‌تر و آشنایی با محصولات، به فروشگاه‌های حضوری هماکام مراجعه کنید. کارشناسان ما در محل، شما را در انتخاب بهترین محصول راهنمایی می‌کنند.',
  branches,
}