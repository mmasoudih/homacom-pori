import { toEnglishDigits } from '~/utils/format'

/** Iranian mobile number: exactly 11 digits, starting with 09. */
export const IRAN_MOBILE_REGEX = /^09[0-9]{9}$/

/** Maximum length of an Iranian mobile number. */
export const MOBILE_MAX_LENGTH = 11

/**
 * Normalise whatever the user typed/pasted into a mobile input:
 * Persian/Arabic digits become ASCII, everything that is not a digit is
 * dropped, and the result is capped at 11 characters.
 */
export function sanitizeMobileInput(value: unknown): string {
  return toEnglishDigits(String(value ?? ''))
    .replace(/\D/g, '')
    .slice(0, MOBILE_MAX_LENGTH)
}

/** Strip separators from a display phone number so it can be used in `tel:`. */
export function toTelHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, '')}`
}

/** Build a `mailto:` link from a display email address. */
export function toMailtoHref(value: string): string {
  return `mailto:${value.trim()}`
}
