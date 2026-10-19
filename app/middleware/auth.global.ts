/**
 * Guard the private dashboard area.
 *
 * Login redirects carry the original path in `?redirect=` so the auth pages can
 * send the user straight back after a successful sign-in.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/dashboard')) return

  const token = useCookie<string | null>('auth_token')
  if (token.value) return

  return navigateTo({
    path: '/auth/login',
    query: { redirect: to.fullPath },
  })
})
