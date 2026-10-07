<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'
import { toPersianDigits } from '~/utils/format'

const props = withDefaults(defineProps<{
  /** 1-based current page. */
  page: number
  /** Total number of pages. */
  pages: number
  /** How many consecutive page numbers to show around the current page. */
  window?: number
  class?: string
}>(), {
  window: 4,
  class: '',
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const visiblePages = computed<(number | 'ellipsis')[]>(() => {
  const total = props.pages
  const size = props.window

  if (total <= size)
    return Array.from({ length: total }, (_, i) => i + 1)

  const start = Math.min(Math.max(1, props.page - Math.floor(size / 2)), total - size + 1)
  const end = start + size - 1

  const items: (number | 'ellipsis')[] = []
  if (start > 1) {
    items.push(1)
    if (start > 2)
      items.push('ellipsis')
  }
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total) {
    if (end < total - 1)
      items.push('ellipsis')
    items.push(total)
  }
  return items
})

function go(page: number) {
  if (page < 1 || page > props.pages || page === props.page)
    return
  emit('update:page', page)
}
</script>

<template>
  <nav :class="cn('flex flex-wrap items-center justify-center gap-4', props.class)" aria-label="صفحه‌بندی">
    <button
      type="button"
      class="flex size-[38px] items-center justify-center rounded-md border border-T-400 text-T-600 transition-colors hover:border-T-500 disabled:opacity-40"
      :disabled="page <= 1"
      aria-label="صفحه قبل"
      @click="go(page - 1)"
    >
      <IconChevronRight class="size-4" />
    </button>

    <div class="flex flex-wrap items-center justify-center gap-1.5">
      <template v-for="(p, i) in visiblePages" :key="`page-${p}-${i}`">
        <span
          v-if="p === 'ellipsis'"
          class="flex size-[38px] items-center justify-center text-T-500"
        >
          <UiTypography as="span" size="xl" weight="medium" color="inherit">…</UiTypography>
        </span>
        <button
          v-else
          type="button"
          class="flex size-[38px] items-center justify-center rounded-md border border-T-400 transition-colors"
          :class="p === page ? 'text-T-900' : 'text-T-700 hover:bg-T-100'"
          :aria-current="p === page ? 'page' : undefined"
          @click="go(p)"
        >
          <UiTypography as="span" size="xl" weight="medium" color="inherit">
            {{ toPersianDigits(p) }}
          </UiTypography>
        </button>
      </template>
    </div>

    <button
      type="button"
      class="flex size-[38px] items-center justify-center rounded-md border border-T-400 text-T-600 transition-colors hover:border-T-500 disabled:opacity-40"
      :disabled="page >= pages"
      aria-label="صفحه بعد"
      @click="go(page + 1)"
    >
      <IconChevronLeft class="size-4" />
    </button>
  </nav>
</template>
