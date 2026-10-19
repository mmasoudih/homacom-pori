// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: { port: 4500, host: "127.0.0.1" },
  css: ["~/assets/css/tailwind.css", "vue-sonner/style.css"],
  app: {
    head: {
      htmlAttrs: { lang: "fa", dir: "rtl" },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://new.ahoma.ir/api",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://homacom.ir",
    },
  },
  // Login and registration are one mobile/OTP flow; keep the old register URL
  // pointing at it instead of maintaining a second page.
  routeRules: {
    "/auth/register": { redirect: { to: "/auth/login", statusCode: 301 } },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxt/eslint'
  ],
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },
  // Single-locale setup today (Persian), but every UI string lives in
  // `i18n/locales/fa.json` so adding another language is a config + file drop.
  i18n: {
    defaultLocale: 'fa',
    strategy: 'no_prefix',
    locales: [
      { code: 'fa', language: 'fa-IR', name: 'فارسی', file: 'fa.json' },
    ],
    detectBrowserLanguage: false,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: true,
      extensions: ['vue'],
    },
  ],
});
