/**
 * Global SEO defaults.
 *
 * Every page automatically gets a canonical URL derived from its path plus a
 * complete set of Open Graph / Twitter defaults. Pages can still override the
 * title/description with their own `useSeoMeta()` call — that call runs after
 * this plugin, so the page-specific values win.
 */
export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  const t = (key: string) => nuxtApp.$i18n.t(key) as string

  const siteUrl = computed(() => String(config.public.siteUrl || 'https://homacom.ir').replace(/\/+$/, ''))
  const path = computed(() => {
    const value = route.path === '/' ? '/' : route.path.replace(/\/+$/, '')
    return value
  })
  const canonical = computed(() => `${siteUrl.value}${path.value === '/' ? '/' : path.value}`)
  const socialImage = computed(() => `${siteUrl.value}/figma/fill-4f5b0b1a98425788.jpg`)

  useSeoMeta({
    title: () => t('seo.defaultTitle'),
    description: () => t('seo.defaultDescription'),
    ogType: 'website',
    ogSiteName: () => t('seo.siteName'),
    ogTitle: () => t('seo.defaultTitle'),
    ogDescription: () => t('seo.defaultDescription'),
    ogUrl: () => canonical.value,
    ogImage: () => socialImage.value,
    ogImageAlt: () => t('seo.siteName'),
    ogLocale: 'fa_IR',
    twitterCard: 'summary_large_image',
    twitterTitle: () => t('seo.defaultTitle'),
    twitterDescription: () => t('seo.defaultDescription'),
    twitterImage: () => socialImage.value,
    robots: 'index,follow',
  })

  useHead({
    link: [
      { rel: 'canonical', href: canonical },
    ],
  })
})
