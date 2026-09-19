import type { Product } from '~/utils/product'

const TITLE =
  'گوشی موبایل سامسونگ مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت'

const IMG = {
  blackHeadset: '/figma/fill-a3b65327303691bb.png',
  pinkHeadset: '/figma/fill-bcf7fdbe4840c6f2.png',
  bluePhone: '/figma/fill-eedc0bf76b5dc7cd.png',
  purpleLaptop: '/figma/fill-6df25cd971d272b0.png',
}

const SWATCH = {
  headset: ['#ff8800', '#8e8e93'],
  phone: ['#1d1d1f', '#ffffff'],
  laptop: ['#1d1d1f', '#ffffff'],
}

function item(
  index: number,
  image: string,
  colors: string[],
  discounted = false,
): Product {
  return {
    id: `fav-${index}`,
    image,
    title: TITLE,
    price: '87,000,000',
    ...(discounted ? { oldPrice: '92,000,000', discount: '%30' } : {}),
    colors,
  }
}

/**
 * Ordered for the RTL grid: index 0 renders in the top-right cell.
 * Nine items fill the desktop 3×3 layout from the reference.
 */
export const favorites: Product[] = [
  // row 1 (right → left): laptop, phone, headset
  item(1, IMG.purpleLaptop, SWATCH.laptop),
  item(2, IMG.bluePhone, SWATCH.phone, true),
  item(3, IMG.blackHeadset, SWATCH.headset),
  // row 2 (right → left): headset, laptop, phone
  item(4, IMG.blackHeadset, SWATCH.headset),
  item(5, IMG.purpleLaptop, SWATCH.laptop),
  item(6, IMG.bluePhone, SWATCH.phone, true),
  // row 3 (right → left): phone, pink headset, headset
  item(7, IMG.bluePhone, SWATCH.phone, true),
  item(8, IMG.pinkHeadset, SWATCH.headset, true),
  item(9, IMG.blackHeadset, SWATCH.headset, true),
]
