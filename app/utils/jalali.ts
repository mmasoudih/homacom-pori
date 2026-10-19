/** Minimal Gregorian ↔ Jalali conversion (jalaali-js algorithm, no dependency). */

function div(a: number, b: number): number {
  return Math.trunc(a / b)
}

function mod(a: number, b: number): number {
  return a - Math.trunc(a / b) * b
}

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
  1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178,
]

function jalCal(jy: number): { leap: number, gy: number, march: number } {
  const bl = BREAKS.length
  const gy = jy + 621
  let leapJ = -14
  let jp = BREAKS[0]!
  let jump = 0

  if (jy < jp || jy >= BREAKS[bl - 1]!)
    throw new RangeError('Invalid Jalali year')

  for (let i = 1; i < bl; i += 1) {
    const jm = BREAKS[i]!
    jump = jm - jp
    if (jy < jm) break
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
    jp = jm
  }

  let n = jy - jp
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150
  const march = 20 + leapJ - leapG

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33
  let leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) leap = 4

  return { leap, gy, march }
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy)
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
}

function d2j(jdn: number): { jy: number, jm: number, jd: number } {
  const gy = d2g(jdn).gy
  let jy = gy - 621
  const r = jalCal(jy)
  const jdn1f = g2d(gy, 3, r.march)
  let k = jdn - jdn1f

  if (k >= 0) {
    if (k <= 185) return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 }
    k -= 186
  }
  else {
    jy -= 1
    k += 179
    if (r.leap === 1) k += 1
  }

  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 }
}

function g2d(gy: number, gm: number, gd: number): number {
  const d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
    + div(153 * mod(gm + 9, 12) + 2, 5)
    + gd - 34840408
  return d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
}

function d2g(jdn: number): { gy: number, gm: number, gd: number } {
  let j = 4 * jdn + 139361631
  j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  const i = div(mod(j, 1461), 4) * 5 + 308
  const gd = div(mod(i, 153), 5) + 1
  const gm = mod(div(i, 153), 12) + 1
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return { gy, gm, gd }
}

export function gregorianToJalali(gy: number, gm: number, gd: number) {
  return d2j(g2d(gy, gm, gd))
}

export function jalaliToGregorian(jy: number, jm: number, jd: number) {
  return d2g(j2d(jy, jm, jd))
}

/** `1990-05-20` → `{ jy, jm, jd }`; `null` for empty/invalid input. */
export function isoToJalali(value?: string | null) {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return null
  return gregorianToJalali(Number(match[1]), Number(match[2]), Number(match[3]))
}

/** Jalali parts → `YYYY-MM-DD` for the API. */
export function jalaliToIso(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = jalaliToGregorian(jy, jm, jd)
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
}
