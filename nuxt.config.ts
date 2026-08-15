// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: { port: 4500, host: "127.0.0.1" },
  css: ["~/assets/css/tailwind.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://ahoma.ir/api",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
    disable: true
  }

});
