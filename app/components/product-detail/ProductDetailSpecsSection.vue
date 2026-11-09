<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import type { SpecTableRow } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    id?: string
    rows: SpecTableRow[]
    moreCount?: number
    groupTitle?: string
    class?: string
  }>(),
  { id: 'product-specs', moreCount: 0, groupTitle: 'مشخصات کلی', class: '' },
)

const emit = defineEmits<{
  'show-more': []
}>()
</script>

<template>
  <section
    :id="props.id"
    :class="cn('flex w-full scroll-mt-24 flex-col gap-4 lg:scroll-mt-6 lg:gap-5', props.class)"
  >
    <!-- Section header: accent mark + 18px title on the design's 22px row -->
    <div class="flex items-center gap-2 lg:h-[22px] lg:gap-1">
      <span class="h-[18px] w-1 rounded-full bg-R-300 lg:hidden" />

      <!-- Accent exported from «Frame 80» of the spec layer -->
      <img
        src="/icons/product-detail/spec-accent-20.svg"
        alt=""
        class="hidden h-5 w-[13px] shrink-0 lg:block"
      >

      <h2 class="text-[16px] font-bold text-T-900 lg:text-[18px] lg:leading-[22px]">مشخصات فنی</h2>
    </div>

    <div class="flex w-full flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
      <p class="text-[14px] font-medium text-T-700 lg:w-[334px] lg:shrink-0 lg:text-[14px] lg:font-bold lg:text-T-600">
        {{ groupTitle }}
      </p>

      <div class="flex w-full flex-col lg:min-w-0 lg:flex-1 lg:gap-[38px]">
        <div class="flex flex-col overflow-hidden rounded-xl lg:overflow-visible lg:rounded-none">
          <div
            v-for="(row, i) in rows"
            :key="row.label"
            class="flex flex-col items-start gap-1 px-5 py-3.5 lg:h-[41px] lg:flex-row lg:items-center lg:justify-between lg:gap-2.5 lg:rounded-[6px] lg:px-3 lg:py-0"
            :class="i % 2 === 0 ? 'bg-R-10 lg:bg-R-25' : 'bg-T-50 lg:bg-transparent'"
          >
            <span class="text-[13px] font-medium text-T-900 lg:text-[12.5px] lg:font-medium lg:text-T-800">{{ row.label }}</span>
            <span class="text-[12.5px] text-T-700 lg:text-[14px] lg:text-T-900 lg:text-left">{{ row.value }}</span>
          </div>
        </div>

        <button
          v-if="moreCount"
          type="button"
          class="flex items-center gap-1 self-center text-[13px] font-medium text-R-300 transition-colors hover:text-R-400 lg:text-[12.5px] lg:font-bold"
          @click="emit('show-more')"
        >
          <IconChevronDown class="size-4 lg:hidden" />
          <span>مشاهده بیشتر</span>
          <img src="/icons/product-detail/angle-down-14.svg" alt="" class="hidden size-3.5 lg:block">
        </button>
      </div>
    </div>
  </section>
</template>
