<script setup lang="ts">
export interface MobileInfoItem {
  label: string
  value: string
  /** Long values (addresses) wrap below the label instead of beside it. */
  stacked?: boolean
}

withDefaults(defineProps<{
  items: MobileInfoItem[]
  divided?: boolean
}>(), {
  divided: true,
})
</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="(item, index) in items"
      :key="`${item.label}-${index}`"
      class="flex gap-3 py-3 text-[13px] first:pt-0 last:pb-0"
      :class="[
        item.stacked ? 'flex-col items-end' : 'items-start justify-between',
        divided && index < items.length - 1 ? 'border-b border-T-300' : '',
      ]"
    >
      <span class="shrink-0 text-T-600">{{ item.label }}</span>
      <span
        class="min-w-0 font-medium text-T-900"
        :class="item.stacked ? 'w-full text-right leading-[24px]' : 'text-left'"
      >
        {{ item.value }}
      </span>
    </div>
  </div>
</template>
