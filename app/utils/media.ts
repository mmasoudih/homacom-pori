/** Turn a backend media path/URL into something an `<img>` can load. */
export function resolveMediaUrl(path: string | null | undefined, apiBase: string): string {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path

  const origin = apiBase.replace(/\/api\/?$/, '')
  return `${origin}/${path.replace(/^\/+/, '')}`
}
