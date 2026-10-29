import type { CheckoutPayment } from '~/composables/useCart'

/**
 * Hand the browser over to the payment gateway.
 *
 * `payment.data` carries the gateway's own fields (Mellat's `RefId`, …). When it
 * is non-empty the gateway expects a POSTed form; otherwise the redirect `url`
 * already contains everything and is followed with a plain GET.
 *
 * Returns `false` when there is nothing to navigate to (wallet/credit methods
 * settle server-side).
 */
export function redirectToGateway(payment: CheckoutPayment): boolean {
  if (!import.meta.client) return false

  const url = payment.url?.trim()
  if (!url) return false

  const fields: Record<string, string> = {}
  for (const [key, value] of Object.entries(payment.data ?? {})) {
    if (value != null) fields[key] = String(value)
  }

  if (!Object.keys(fields).length) {
    window.location.assign(url)
    return true
  }

  // Some gateways read the token from the form instead of the query string.
  if (payment.token && !('token' in fields) && !('Token' in fields) && !('RefId' in fields))
    fields.token = payment.token

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = url
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
