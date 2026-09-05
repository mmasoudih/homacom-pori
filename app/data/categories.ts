export interface Category {
  id: string
  title: string
  icon?: string
  children?: Category[]
}

/**
 * Default selection reproduced on open, matching the reference screenshot:
 * گوشی موبایل → آنر → تبلت
 */
export const initialMegaPath = ['mobile', 'honor', 'honor-tablet']

export const megaCategories: Category[] = [
  {
    id: 'mobile',
    title: 'گوشی موبایل',
    icon: 'mobile',
    children: [
      {
        id: 'iphone',
        title: 'آیفون',
        children: [
          { id: 'iphone-16', title: 'آیفون ۱۶' },
          { id: 'iphone-15', title: 'آیفون ۱۵' },
          { id: 'iphone-14', title: 'آیفون ۱۴' },
          { id: 'iphone-se', title: 'آیفون SE' },
        ],
      },
      {
        id: 'samsung',
        title: 'سامسونگ',
        children: [
          { id: 'galaxy-s', title: 'گلکسی S' },
          { id: 'galaxy-a', title: 'گلکسی A' },
          { id: 'galaxy-z', title: 'گلکسی Z' },
        ],
      },
      {
        id: 'xiaomi',
        title: 'شیائومی',
        children: [
          { id: 'xiaomi-14', title: 'شیائومی ۱۴' },
          { id: 'redmi', title: 'ردمی' },
          { id: 'poco', title: 'پوکو' },
        ],
      },
      {
        id: 'honor',
        title: 'آنر',
        children: [
          { id: 'honor-steel', title: 'فولاد' },
          { id: 'honor-tablet', title: 'تبلت' },
          { id: 'honor-regular', title: 'معمولی' },
          { id: 'honor-mini', title: 'مینی' },
        ],
      },
      {
        id: 'sony',
        title: 'سونی',
        children: [
          { id: 'xperia', title: 'اکسپریا' },
          { id: 'sony-1', title: 'سونی ۱' },
          { id: 'sony-5', title: 'سونی ۵' },
        ],
      },
      {
        id: 'oneplus',
        title: 'وان پلاس',
        children: [
          { id: 'oneplus-12', title: 'وان پلاس ۱۲' },
          { id: 'oneplus-11', title: 'وان پلاس ۱۱' },
          { id: 'oneplus-nord', title: 'وان پلاس نورد' },
        ],
      },
    ],
  },
  {
    id: 'laptop',
    title: 'لپ‌تاپ و تبلت',
    icon: 'laptop',
    children: [
      {
        id: 'apple',
        title: 'اپل',
        children: [
          { id: 'macbook-air', title: 'مک‌بوک ایر' },
          { id: 'macbook-pro', title: 'مک‌بوک پرو' },
          { id: 'ipad-pro', title: 'آیپد پرو' },
          { id: 'ipad-air', title: 'آیپد ایر' },
        ],
      },
      {
        id: 'lenovo',
        title: 'لنوو',
        children: [
          { id: 'ideapad', title: 'آیدیاپد' },
          { id: 'thinkpad', title: 'تینک‌پد' },
          { id: 'legion', title: 'لژیون' },
        ],
      },
      {
        id: 'asus',
        title: 'ایسوس',
        children: [
          { id: 'rog', title: 'آراو‌جی' },
          { id: 'vivobook', title: 'ویووبوک' },
          { id: 'zenbook', title: 'زن‌بوک' },
        ],
      },
      {
        id: 'dell',
        title: 'دل',
        children: [
          { id: 'xps', title: 'ایکس‌پی‌اس' },
          { id: 'inspiron', title: 'این‌سپایرون' },
          { id: 'alienware', title: 'ایلی‌ن‌ویر' },
        ],
      },
      {
        id: 'acer',
        title: 'ایسر',
        children: [
          { id: 'aspire', title: 'اسپایر' },
          { id: 'swift', title: 'سوییفت' },
          { id: 'predator', title: 'پردیتور' },
        ],
      },
      {
        id: 'samsung-tab',
        title: 'سامسونگ',
        children: [
          { id: 'galaxy-tab-s', title: 'گلکسی تب S' },
          { id: 'galaxy-tab-a', title: 'گلکسی تب A' },
        ],
      },
    ],
  },
  {
    id: 'watch',
    title: 'ساعت هوشمند',
    icon: 'watch',
    children: [
      {
        id: 'apple-watch',
        title: 'اپل',
        children: [
          { id: 'watch-s9', title: 'واچ سری ۹' },
          { id: 'watch-s8', title: 'واچ سری ۸' },
          { id: 'watch-ultra', title: 'واچ اولترا' },
        ],
      },
      {
        id: 'samsung-watch',
        title: 'سامسونگ',
        children: [
          { id: 'galaxy-watch-6', title: 'گلکسی واچ ۶' },
          { id: 'galaxy-watch-5', title: 'گلکسی واچ ۵' },
        ],
      },
      {
        id: 'xiaomi-watch',
        title: 'شیائومی',
        children: [
          { id: 'mi-band', title: 'مای بند' },
          { id: 'redmi-watch', title: 'ردمی واچ' },
        ],
      },
      {
        id: 'huawei-watch',
        title: 'هواوی',
        children: [
          { id: 'gt-4', title: 'جی‌تی ۴' },
          { id: 'gt-3', title: 'جی‌تی ۳' },
        ],
      },
      {
        id: 'amazfit',
        title: 'امیزفیت',
        children: [
          { id: 'gtr', title: 'جی‌تی‌آر' },
          { id: 'bip', title: 'بیپ' },
        ],
      },
    ],
  },
  {
    id: 'headphones',
    title: 'هدفون و هندزفری',
    icon: 'headphones',
    children: [
      {
        id: 'airpods',
        title: 'ایرپادز',
        children: [
          { id: 'airpods-pro', title: 'ایرپادز پرو' },
          { id: 'airpods-3', title: 'ایرپادز ۳' },
          { id: 'airpods-max', title: 'ایرپادز مکس' },
        ],
      },
      {
        id: 'sony-audio',
        title: 'سونی',
        children: [
          { id: 'wh-1000xm5', title: 'WH-1000XM5' },
          { id: 'wf-1000xm5', title: 'WF-1000XM5' },
        ],
      },
      {
        id: 'bose',
        title: 'بوز',
        children: [
          { id: 'qc45', title: 'QC45' },
          { id: 'qc-earbuds', title: 'QC Earbuds' },
        ],
      },
      {
        id: 'jbl',
        title: 'جی‌بی‌ال',
        children: [
          { id: 'tune', title: 'تیون' },
          { id: 'live', title: 'لایو' },
        ],
      },
      {
        id: 'anker',
        title: 'انکر',
        children: [
          { id: 'soundcore', title: 'ساندکور' },
          { id: 'liberty', title: 'لیبرتی' },
        ],
      },
    ],
  },
  {
    id: 'console',
    title: 'کنسول بازی',
    icon: 'gamepad',
    children: [
      {
        id: 'playstation',
        title: 'پلی‌استیشن',
        children: [
          { id: 'ps5', title: 'پلی‌استیشن ۵' },
          { id: 'ps4', title: 'پلی‌استیشن ۴' },
          { id: 'ps5-controller', title: 'دسته پلی‌استیشن' },
        ],
      },
      {
        id: 'xbox',
        title: 'ایکس‌باکس',
        children: [
          { id: 'xbox-series-x', title: 'ایکس‌باکس سری X' },
          { id: 'xbox-series-s', title: 'ایکس‌باکس سری S' },
        ],
      },
      {
        id: 'nintendo',
        title: 'نینتندو',
        children: [
          { id: 'switch', title: 'نینتندو سوییچ' },
          { id: 'switch-lite', title: 'سوییچ لایت' },
        ],
      },
    ],
  },
  {
    id: 'computer',
    title: 'کامپیوتر',
    icon: 'display',
    children: [
      {
        id: 'case',
        title: 'کیس',
        children: [
          { id: 'gaming-case', title: 'کیس گیمینگ' },
          { id: 'office-case', title: 'کیس اداری' },
        ],
      },
      {
        id: 'monitor',
        title: 'مانیتور',
        children: [
          { id: 'gaming-monitor', title: 'مانیتور گیمینگ' },
          { id: 'office-monitor', title: 'مانیتور اداری' },
        ],
      },
      {
        id: 'parts',
        title: 'قطعات',
        children: [
          { id: 'cpu', title: 'پردازنده' },
          { id: 'gpu', title: 'کارت گرافیک' },
          { id: 'ram', title: 'رم' },
          { id: 'storage', title: 'حافظه' },
        ],
      },
    ],
  },
  {
    id: 'accessories',
    title: 'لوازم جانبی',
    icon: 'usb',
    children: [
      {
        id: 'keyboard-mouse',
        title: 'کیبورد و ماوس',
        children: [
          { id: 'mechanical-kb', title: 'کیبورد مکانیکال' },
          { id: 'wireless-mouse', title: 'ماوس بی‌سیم' },
        ],
      },
      {
        id: 'cable',
        title: 'کابل',
        children: [
          { id: 'usb-c', title: 'کابل USB-C' },
          { id: 'lightning', title: 'کابل لایتنینگ' },
        ],
      },
      {
        id: 'charger',
        title: 'شارژر',
        children: [
          { id: 'wall-charger', title: 'شارژر دیواری' },
          { id: 'car-charger', title: 'شارژر فندکی' },
        ],
      },
      {
        id: 'powerbank',
        title: 'پاوربانک',
        children: [
          { id: 'pb-10k', title: '۱۰ هزار میلی‌آمپر' },
          { id: 'pb-20k', title: '۲۰ هزار میلی‌آمپر' },
        ],
      },
    ],
  },
  {
    id: 'av',
    title: 'صوتی تصویری',
    icon: 'speakers',
    children: [
      {
        id: 'speaker',
        title: 'بلندگو',
        children: [
          { id: 'home-speaker', title: 'بلندگوی خانگی' },
          { id: 'portable-speaker', title: 'بلندگوی قابل حمل' },
        ],
      },
      {
        id: 'soundbar',
        title: 'ساندبار',
        children: [
          { id: 'soundbar-2ch', title: 'دو کاناله' },
          { id: 'soundbar-5ch', title: 'پنج کاناله' },
        ],
      },
      {
        id: 'tv',
        title: 'تلویزیون',
        children: [
          { id: 'led-tv', title: 'LED' },
          { id: 'oled-tv', title: 'OLED' },
        ],
      },
      {
        id: 'projector',
        title: 'پروژکتور',
        children: [
          { id: 'fullhd-projector', title: 'فول‌اچ‌دی' },
          { id: '4k-projector', title: '۴K' },
        ],
      },
    ],
  },
]