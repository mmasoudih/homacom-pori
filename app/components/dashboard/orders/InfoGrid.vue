<script setup lang="ts">
export interface InfoItem {
  label: string
  value: string
  /** Render value in LTR (codes, phones). */
  ltr?: boolean
}

withDefaults(defineProps<{
  items: InfoItem[]
  cols?: 2 | 3
}>(), {
  cols: 3,
})
</script>

<template>
  <div
    class="grid gap-x-6 gap-y-6"
    :class="cols === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'"
  >
    <div v-for="item in items" :key="item.label" class="flex flex-col items-center gap-2 text-center">
      <span class="text-[12px] text-T-600">{{ item.label }}</span>
      <span
        class="text-[13px] font-bold text-T-900"
        :dir="item.ltr ? 'ltr' : undefined"
      >
        {{ item.value }}
      </span>
    </div>
  </div>
</template>
