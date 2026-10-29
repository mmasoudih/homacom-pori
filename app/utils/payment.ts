/** Gateway redirect payload — the same shape for `POST /cart/checkout` and
 * `POST /wallet/charge` (`success`, `gate`, `url`, `token`, `message`, `data`).
 */
export interface GatewayRedirect {
  /** `false` means the gateway refused to start the payment. */
  success?: boolean
  gate?: string | null
  url?: string | null
  token?: string | null
  message?: string | null
  /** Gateway form fields, or a nested redirect, depending on the gateway. */
  data?: Record<string, unknown> | string | null
}

/** Gateway keys → the label shown instead of the raw `payment_method`. */
const GATEWAY_LABELS: Record<string, string> = {
  mellat: 'بانک ملت',
  melli: 'بانک ملی',
  saman: 'بانک سامان',
  sepah: 'بانک سپه',
  tara: 'درگاه تارا',
  azki: 'آزکی',
  mycredit: 'کیف پول هماکام',
}

/**
 * Human label for `order.gate`.
 *
 * `payment_method` is overwritten with `manual` by the settlement step, so the
 * gateway is the only field that still says how the customer actually paid.
 */
export function gatewayLabel(gate?: string | null): string {
  if (!gate) return ''
  return GATEWAY_LABELS[gate.toLowerCase()] ?? gate
}

export type PaymentDevice = 'web' | 'mobile' | 'desktop' | 'tablet' | 'pwa'

/** Best-effort `device` value for the checkout / wallet-charge payloads. */
export function detectDevice(): PaymentDevice {
  if (!import.meta.client) return 'web'

  const ua = navigator.userAgent
  if (/iPad|Tablet/i.test(ua)) return 'tablet'
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile'

  return 'desktop'
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim())
}

/**
 * Some gateways put their redirect inside `payment.data` instead of `url`
 * (either as the value itself, `data.url`, or `data.data.url`).
 */
function findNestedUrl(value: unknown, depth = 0): string {
  if (depth > 3) return ''
  if (typeof value === 'string') return isAbsoluteUrl(value) ? value.trim() : ''
  if (!value || typeof value !== 'object') return ''

  const record = value as Record<string, unknown>

  for (const key of ['url', 'redirect', 'redirect_url', 'link', 'href']) {
    const candidate = record[key]
    if (typeof candidate === 'string' && isAbsoluteUrl(candidate)) return candidate.trim()
  }

  for (const candidate of Object.values(record)) {
    const url = findNestedUrl(candidate, depth + 1)
    if (url) return url
  }

  return ''
}

/**
 * Hand the browser over to the payment gateway.
 *
 * `payment.data` carries the gateway's own fields (Mellat's `RefId`, …). When it
 * is a non-empty object the gateway expects a POSTed form; otherwise the
 * redirect `url` already contains everything and is followed with a plain GET.
 * When `url` is missing the redirect may still be nested in `data`.
 *
 * Returns `false` when there is nothing to navigate to (wallet/credit methods
 * settle server-side).
 */
export function redirectToGateway(payment: GatewayRedirect): boolean {
  if (!import.meta.client) return false

  const target = payment.url?.trim() || findNestedUrl(payment.data)
  if (!target) return false

  // Only plain objects are form fields; a string would be a redirect.
  const data = payment.data && typeof payment.data === 'object' ? payment.data : null

  const fields: Record<string, string> = {}
  for (const [key, value] of Object.entries(data ?? {})) {
    if (value != null && typeof value !== 'object') fields[key] = String(value)
  }

  if (!Object.keys(fields).length) {
    window.location.assign(target)
    return true
  }

  // Some gateways read the token from the form instead of the query string.
  if (payment.token && !('token' in fields) && !('Token' in fields) && !('RefId' in fields))
    fields.token = payment.token

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = target
  form.style.display = 'none'

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.append(input)
  }

  document.body.append(form)
  form.submit()
  return true
}
