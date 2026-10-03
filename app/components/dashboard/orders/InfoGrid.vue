<script setup lang="ts">
export interface InfoItem {
  label: string
  value: string
  /** Render value in LTR (codes, phones). */
  ltr?: boolean
  /** Span two-thirds of the row on desktop (3-column layout). */
  wide?: boolean
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
    :class="cols === 3 ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-2'"
  >
    <div
      v-for="item in items"
      :key="item.label"
      class="flex flex-col items-start gap-2 text-right"
      :class="cols === 3 ? (item.wide ? 'lg:col-span-8' : 'lg:col-span-4') : ''"
    >
      <UiTypography as="span" size="md" weight="medium" color="subtle">{{ item.label }}</UiTypography>
      <span
        class="text-[13px] font-bold text-T-900"
        :dir="item.ltr ? 'ltr' : undefined"
      >
        {{ item.value }}
      </span>
    </div>

    <slot />
  </div>
</template>
