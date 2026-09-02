<script setup lang="ts">
import {
  IconRulerMeasure,
  IconCpu,
  IconDeviceSdCard,
  IconCamera,
  IconBattery2,
  IconDeviceMobile,
  IconBadgeSd,
  IconApps,
  IconChevronDown,
} from '@tabler/icons-vue'
import type { FeatureRow } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    id?: string
    rows: FeatureRow[]
    moreCount?: number
    class?: string
  }>(),
  { id: 'product-features', moreCount: 0, class: '' },
)

const iconMap = {
  dimensions: IconRulerMeasure,
  cpu: IconCpu,
  memory: IconDeviceSdCard,
  camera: IconCamera,
  battery: IconBattery2,
  display: IconDeviceMobile,
  sim: IconBadgeSd,
  os: IconApps,
} as const
</script>

<template>
  <section :id="props.id" :class="cn('flex w-full scroll-mt-6 flex-col gap-4', props.class)">
    <div class="flex items-center gap-2">
      <span class="h-[18px] w-1 rounded-full bg-R-300" />
      <h2 class="text-[16px] font-bold text-T-900">ویژگی‌ها و مشخصات</h2>
    </div>

    <div class="flex flex-col overflow-hidden rounded-2xl border border-T-300 bg-T-50">
      <div
        v-for="(row, i) in rows"
        :key="row.label"
        class="flex items-center justify-between px-4 py-3.5"
        :class="i > 0 && 'border-t border-T-300'"
      >
        <span class="flex items-center gap-2.5 text-[13px] text-T-900">
          <component :is="iconMap[row.icon]" class="size-5 text-T-600" stroke-width="1.5" />
          {{ row.label }}
        </span>
        <span class="text-[12.5px] text-T-700">{{ row.value }}</span>
      </div>
    </div>

    <button
      v-if="moreCount"
      type="button"
      class="flex items-center gap-1 self-start text-[12.5px] font-medium text-R-300 transition-colors hover:text-R-400"
    >
      <IconChevronDown class="size-4" />
      {{ moreCount }} ویژگی بیشتر
    </button>
  </section>
</template>
