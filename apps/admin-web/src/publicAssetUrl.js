const publicSiteUrl = `${(import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, '')}/`

export function publicAssetUrl(value) {
  if (typeof value === 'string' && /^\/(?:assets\/|data\/|logo-olcomep\.png$|logotipo(?:%20| )MEP\.png$)/i.test(value)) {
    return new URL(value.slice(1), publicSiteUrl).href
  }
  if (Array.isArray(value)) return value.map(publicAssetUrl)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, publicAssetUrl(item)]))
  return value
}
