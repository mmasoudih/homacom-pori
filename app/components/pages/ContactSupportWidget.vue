<script setup lang="ts">
import type { ContactPopupEntry } from '~/composables/useShopContent'

/**
 * Floating support widget fed by `GET /shop/public/contact` (`contact_popup`).
 * Rendered only when `contact_popup_status === "enable"` and the array is not
 * empty; unknown/malformed entries collapse to nothing in the composable.
 */
const props = defineProps<{
  entries?: ContactPopupEntry[]
  enabled?: boolean
}>()

const visible = computed(() => props.enabled === true && (props.entries?.length ?? 0) > 0)

function isIconUrl(icon?: string): boolean {
  return !!icon && /^(https?:\/\/|\/|data:)/.test(icon)
}

function isExternal(link?: string): boolean {
  return !!link && /^https?:\/\//.test(link)
}
</script>

<template>
  <div
    v-if="visible"
    class="fixed bottom-20 end-3 z-40 flex flex-col items-end gap-2 lg:bottom-6 lg:end-6"
  >
    <component
      :is="entry.link ? 'a' : 'div'"
      v-for="(entry, index) in entries"
      :key="`${entry.link}-${index}`"
      :href="entry.link || undefined"
      :target="isExternal(entry.link) ? '_blank' : undefined"
      :rel="isExternal(entry.link) ? 'noopener noreferrer' : undefined"
      class="flex h-11 items-center gap-2 rounded-full border border-T-400 bg-T-50 px-4 text-T-900 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-colors hover:border-primary hover:text-primary"
      :class="entry.class"
      :style="entry.style"
    >
      <img
        v-if="isIconUrl(entry.icon)"
        :src="entry.icon"
        alt=""
        class="size-5 shrink-0 object-contain"
      >
      <span
        v-else-if="entry.icon"
        :class="entry.icon"
        aria-hidden="true"
      />

      <UiTypography
        v-if="entry.title"
        as="span"
        size="md"
        weight="medium"
        color="inherit"
      >
        {{ entry.title }}
      </UiTypography>
    </component>
  </div>
</template>
