<script setup lang="ts">
import type { BlogNavItem } from '~/data/blog'

const props = defineProps<{
  item: BlogNavItem
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div
    class="absolute -start-2 top-8 z-50 mt-2 w-[310px] rounded-2xl bg-T-50 p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
    role="menu"
    :aria-label="props.item.label"
  >
    <NuxtLink
      v-for="child in props.item.children"
      :key="child.slug"
      :to="`/blog/${props.item.slug}?sub=${child.slug}`"
      class="flex h-11 items-center rounded-xl px-4 text-[15px] text-T-700 transition-colors hover:bg-T-200 hover:text-T-900"
      role="menuitem"
      @click="emit('close')"
    >
      {{ child.label }}
    </NuxtLink>
  </div>
</template>
