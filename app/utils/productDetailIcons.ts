import type { ServiceCategory } from '~/data/product'

const BASE = '/icons/product-detail'

/** Category icons used inside the add-services dialog (24px, dark). */
export const SERVICE_ICON_SRC: Record<ServiceCategory['icon'], string> = {
  sim: `${BASE}/memory-ram-24.svg`,
  insurance: `${BASE}/shield-24.svg`,
  invoice: `${BASE}/package-check-circle-24.svg`,
  warranty: `${BASE}/shield-24.svg`,
  charger: `${BASE}/bolt-24.svg`,
  accessory: `${BASE}/usb-drive-24.svg`,
  games: `${BASE}/game-controller-24.svg`,
  apps: `${BASE}/package-check-circle-24.svg`,
}

/** Category icons used by the selected-services chips (20px, brand red). */
export const SERVICE_CHIP_ICON_SRC: Record<ServiceCategory['icon'], string> = {
  sim: `${BASE}/memory-ram-24-red.svg`,
  insurance: `${BASE}/shield-20.svg`,
  invoice: `${BASE}/package-check-circle-24-red.svg`,
  warranty: `${BASE}/shield-20.svg`,
  charger: `${BASE}/bolt-24-red.svg`,
  accessory: `${BASE}/usb-drive-24-red.svg`,
  games: `${BASE}/game-controller-20.svg`,
  apps: `${BASE}/package-check-circle-24-red.svg`,
}

/** Gray rating faces (unselected). Keyed by rating value. */
export const RATING_FACE_SRC: Record<number, string> = {
  5: `${BASE}/faces/heart-eyes.svg`,
  4: `${BASE}/faces/laugh.svg`,
  3: `${BASE}/faces/happy.svg`,
  2: `${BASE}/faces/sad.svg`,
  1: `${BASE}/faces/cry.svg`,
}

/** Colored rating faces (selected). */
export const RATING_FACE_SELECTED_SRC: Record<number, string> = {
  5: `${BASE}/faces/selected-heart-eyes.svg`,
  4: `${BASE}/faces/selected-laugh.svg`,
  3: `${BASE}/faces/selected-happy.svg`,
  2: `${BASE}/faces/selected-sad.svg`,
  1: `${BASE}/faces/selected-cry.svg`,
}
