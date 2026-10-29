/**
 * Turn a backend media path/URL into something an `<img>` can load.
 *
 * The API now returns absolute URLs (`https://host/storage/...`), but older
 * payloads still carry `storage/...` or `uploads/...` relative paths — those are
 * resolved against the API origin (the `/api` prefix is stripped).
 */
export function resolveMediaUrl(path: string | null | undefined, apiBase: string): string {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path

  const origin = apiBase.replace(/\/api\/?$/, '')
  return `${origin}/${path.replace(/^\/+/, '')}`
}
