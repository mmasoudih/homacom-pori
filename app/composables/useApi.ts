/** Standard envelope returned by every Homacom API endpoint. */
export interface ApiEnvelope<T = unknown> {
  success?: boolean
  message?: string
  data?: T
}

/** Pagination block used by list endpoints (`data.pagination`). */
export interface ApiPagination {
  total: number
  count: number
  per_page: number
  current_page: number
  last_page: number
  has_more_pages: boolean
}

/** Laravel validation / error payload shape. */
export interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[]>
  error?: Record<string, string[]>
  msg?: string
}

/** Error thrown for every failed API call (network, HTTP or `success: false`). */
export class ApiError extends Error {
  readonly status: number
  readonly data?: ApiErrorPayload

  constructor(message: string, status = 0, data?: ApiErrorPayload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/** Pull a human-readable message out of an API error (incl. Laravel validation). */
export function apiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError && err.message) return err.message

  const payload = (err as { data?: ApiErrorPayload })?.data
  const fieldErrors = payload?.errors ?? payload?.error
  const firstFieldError = fieldErrors
    ? Object.values(fieldErrors).flat().at(0)
    : undefined

  return firstFieldError
    || payload?.message
    || payload?.msg
    || (err instanceof Error ? err.message : '')
    || fallback
}

type NitroFetchOptions = NonNullable<Parameters<typeof $fetch>[1]>
type ApiBody = NitroFetchOptions['body']

export type ApiRequestOptions = NitroFetchOptions & {
  /** Do not attach the bearer token. */
  skipAuth?: boolean
  /** Do not try to refresh the token on a 401. */
  skipRefresh?: boolean
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err

  const status = (err as { response?: { status?: number } })?.response?.status ?? 0
  const data = (err as { data?: ApiErrorPayload })?.data
  return new ApiError(apiErrorMessage(err, 'خطا در ارتباط با سرور'), status, data)
}

/**
 * Shared HTTP client for the Homacom backend.
 *
 * - prefixes the configured `apiBase`
 * - sends `Authorization: Bearer <auth_token>` from the session cookie
 * - sends `X-Cart-Token` when a guest cart token is stored
 * - normalises every failure into {@link ApiError}
 * - refreshes the token once on a 401 and retries the original request
 */
export function useApi() {
  const config = useRuntimeConfig()
  const base = computed(() => String(config.public.apiBase || '').replace(/\/+$/, ''))
  const token = useCookie<string | null>('auth_token')
  const cartToken = useCookie<string | null>('cart_token')

  // Kept per composable instance so concurrent SSR requests never share a
  // refresh attempt (that would leak one user's token into another response).
  let refreshInFlight: Promise<boolean> | null = null

  function resolveUrl(path: string): string {
    if (/^https?:\/\//.test(path)) return path
    return `${base.value}/${path.replace(/^\/+/, '')}`
  }

  async function requestOnce<T>(path: string, options: ApiRequestOptions): Promise<ApiEnvelope<T>> {
    const { skipAuth: _skipAuth, skipRefresh: _skipRefresh, headers, ...rest } = options
    const requestHeaders = new Headers(headers as HeadersInit | undefined)
    requestHeaders.set('Accept', 'application/json')

    if (!_skipAuth && token.value)
      requestHeaders.set('Authorization', `Bearer ${token.value}`)
    if (cartToken.value)
      requestHeaders.set('X-Cart-Token', cartToken.value)

    try {
      const res = await $fetch<ApiEnvelope<T>>(resolveUrl(path), {
        ...rest,
        headers: requestHeaders,
      })

      if (res?.success === false)
        throw new ApiError(res.message || 'درخواست با خطا مواجه شد.', 200, res as ApiErrorPayload)

      return res ?? {}
    }
    catch (err) {
      throw toApiError(err)
    }
  }

  async function refreshToken(): Promise<boolean> {
    if (!refreshInFlight) {
      refreshInFlight = (async () => {
        try {
          const res = await requestOnce<{ token: string }>('/auth/refresh', {
            method: 'POST',
            skipRefresh: true,
          })
          const next = res.data?.token
          if (!next) return false
          token.value = next
          return true
        }
        catch {
          token.value = null
          return false
        }
        finally {
          refreshInFlight = null
        }
      })()
    }
    return refreshInFlight
  }

  async function request<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<ApiEnvelope<T>> {
    try {
      return await requestOnce<T>(path, options)
    }
    catch (err) {
      const isAuthPath = path.replace(/^\/+/, '').startsWith('auth/')
      if (
        err instanceof ApiError
        && err.status === 401
        && token.value
        && !options.skipAuth
        && !options.skipRefresh
        && !isAuthPath
      ) {
        const refreshed = await refreshToken()
        if (refreshed) return requestOnce<T>(path, options)
      }
      throw err
    }
  }

  function get<T = unknown>(path: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'GET' })
  }

  function post<T = unknown>(path: string, body?: ApiBody, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'POST', body })
  }

  function put<T = unknown>(path: string, body?: ApiBody, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'PUT', body })
  }

  function patch<T = unknown>(path: string, body?: ApiBody, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'PATCH', body })
  }

  function del<T = unknown>(path: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'DELETE' })
  }

  /** Persist a guest cart token returned by the backend. */
  function setCartToken(value: string | null) {
    cartToken.value = value
  }

  return { base, token, cartToken, request, get, post, put, patch, del, setCartToken }
}
