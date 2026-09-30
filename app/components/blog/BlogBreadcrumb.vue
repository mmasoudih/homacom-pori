<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  /** Ordered right → left (RTL). The last entry is the current page. */
  items: { label: string, to?: string }[]
  class?: string
}>(), {
  class: '',
})
</script>

<template>
  <nav
    :class="cn('flex min-w-0 items-center gap-2 text-[13px] leading-5 lg:text-[13.5px]', props.class)"
    aria-label="مسیر صفحه"
  >
    <template v-for="(crumb, i) in items" :key="i">
      <IconChevronLeft
        v-if="i > 0"
        class="size-3.5 shrink-0"
        :class="i === items.length - 1 ? 'text-primary' : 'text-T-500'"
      />
      <NuxtLink
        v-if="crumb.to && i < items.length - 1"
        :to="crumb.to"
        class="shrink-0 text-T-700 transition-colors hover:text-primary"
      >
        {{ crumb.label }}
      </NuxtLink>
      <span
        v-else
        class="min-w-0 truncate"
        :class="i === items.length - 1 ? 'font-medium text-T-900' : 'text-T-700'"
      >
        {{ crumb.label }}
      </span>
    </template>
  </nav>
</template>
