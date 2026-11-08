/**
 * Guard the pages that need a session.
 *
 * `/dashboard` is the account area, `/checkout` is session-only because both
 * `set-shipping` and `cart/checkout` require a bearer token. Login redirects
 * carry the original path in `?redirect=` so the auth pages can send the user
 * straight back after a successful sign-in.
 */
const PROTECTED_PREFIXES = ['/dashboard', '/checkout']

export default defineNuxtRouteMiddleware((to) => {
  const isProtected = PROTECTED_PREFIXES.some(
    prefix => to.path === prefix || to.path.startsWith(`${prefix}/`),
  )
  if (!isProtected) return

  const token = useCookie<string | null>('auth_token')
  if (token.value) return

  return navigateTo({
    path: '/auth/login',
    query: { redirect: to.fullPath },
  })
})
