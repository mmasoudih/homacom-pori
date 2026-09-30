<script setup lang="ts">
import { cn } from '~/lib/utils'

/**
 * Chrome shared by every blog route: the blog header, the page body, the shop
 * band and the site footer.
 *
 * The project renders page chrome inside each page (there is no `NuxtLayout` in
 * `app.vue`), so the blog uses this shell component instead of a layout file.
 * The mobile bottom nav is intentionally absent on blog pages.
 */
const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: '',
})
</script>

<template>
  <div :class="cn('flex min-h-dvh flex-col bg-T-50', props.class)">
    <BlogSiteHeader />

    <main class="flex w-full flex-1 flex-col items-center lg:px-6">
      <slot />
    </main>

    <BlogShopBand class="pt-10 lg:pt-[62px]" />

    <LandingSiteFooter class="mt-5" />
  </div>
</template>
