<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import type { SpecTableRow } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    id?: string
    rows: SpecTableRow[]
    moreCount?: number
    class?: string
  }>(),
  { id: 'product-specs', moreCount: 0, class: '' },
)

const emit = defineEmits<{
  'show-more': []
}>()
</script>

<template>
  <section :id="props.id" :class="cn('flex w-full scroll-mt-6 flex-col gap-4', props.class)">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="h-[18px] w-1 rounded-full bg-R-300" />
        <h2 class="text-[16px] font-bold text-T-900">مشخصات فنی</h2>
      </div>
      <button
        type="button"
        class="hidden items-center gap-1 text-[12.5px] text-T-700 transition-colors hover:text-R-300 lg:flex"
      >
        مشاهده همه
        <IconChevronDown class="size-4" />
      </button>
    </div>

    <div class="overflow-hidden rounded-2xl border border-T-300">
      <div
        v-for="(row, i) in rows"
        :key="row.label"
        class="flex flex-col items-start gap-1 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
        :class="i % 2 === 0 ? 'bg-R-10/40' : 'bg-T-50'"
      >
        <span class="text-[13px] font-medium text-T-900">{{ row.label }}</span>
        <span class="text-[12.5px] text-T-700">{{ row.value }}</span>
      </div>
    </div>

    <button
      v-if="moreCount"
      type="button"
      class="flex items-center gap-1 self-start text-[12.5px] font-medium text-R-300 transition-colors hover:text-R-400"
      @click="emit('show-more')"
    >
      <IconChevronDown class="size-4" />
      {{ moreCount }} مشخصات بیشتر
    </button>
  </section>
</template>
