<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'
import { toPersianDigits } from '~/utils/format'

const props = withDefaults(defineProps<{
  /** 1-based current page. */
  page: number
  total: number
  class?: string
}>(), {
  class: '',
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

/**
 * RTL page list: `۱ ۲ ۳ ۴ … ۱۲۵` (ascending right → left), with a window around
 * the current page so long ranges stay compact.
 */
const items = computed<(number | 'gap')[]>(() => {
  const total = props.total
  const current = props.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const window = [current - 1, current, current + 1].filter(p => p > 1 && p < total)
  const list: (number | 'gap')[] = [1]
  if (window[0]! > 2) list.push('gap')
  list.push(...window)
  if (window[window.length - 1]! < total - 1) list.push('gap')
  list.push(total)
  return list
})

function goTo(page: number) {
  if (page < 1 || page > props.total || page === props.page) return
  emit('update:page', page)
}
</script>

<template>
  <nav
    :class="cn('flex flex-wrap items-center justify-center gap-2 lg:gap-2.5', props.class)"
    aria-label="صفحه‌بندی"
  >
    <!-- Previous page («›» sits at the right edge in RTL) -->
    <button
      type="button"
      class="flex size-[34px] items-center justify-center rounded-xl border border-T-400 text-T-700 transition-colors hover:border-T-500 disabled:cursor-not-allowed disabled:opacity-40 lg:size-[38px]"
      aria-label="صفحه قبل"
      :disabled="page <= 1"
      @click="goTo(page - 1)"
    >
      <IconChevronRight class="size-4" />
    </button>

    <template v-for="(item, i) in items" :key="`${item}-${i}`">
      <span
        v-if="item === 'gap'"
        class="flex size-[34px] items-center justify-center rounded-xl border border-T-400 text-[13.5px] text-T-600 lg:size-[38px]"
        aria-hidden="true"
      >
        …
      </span>
      <button
        v-else
        type="button"
        class="flex size-[34px] items-center justify-center rounded-xl border text-[13.5px] transition-colors lg:size-[38px]"
        :class="item === page
          ? 'border-T-600 font-bold text-foreground'
          : 'border-T-400 text-T-700 hover:border-T-500'"
        :aria-current="item === page ? 'page' : undefined"
        @click="goTo(item as number)"
      >
        {{ toPersianDigits(item) }}
      </button>
    </template>

    <!-- Next page -->
    <button
      type="button"
      class="flex size-[34px] items-center justify-center rounded-xl border border-T-400 text-T-700 transition-colors hover:border-T-500 disabled:cursor-not-allowed disabled:opacity-40 lg:size-[38px]"
      aria-label="صفحه بعد"
      :disabled="page >= total"
      @click="goTo(page + 1)"
    >
      <IconChevronLeft class="size-4" />
    </button>
  </nav>
</template>
