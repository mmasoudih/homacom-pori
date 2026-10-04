<script setup lang="ts">
const props = withDefaults(defineProps<{
  items: Array<{ image: string, alt?: string, href?: string }>
  columns: 1 | 2 | 3 | 4
  centered?: boolean
  /** Columns per row on mobile; desktop always uses `columns`. Defaults to 1. */
  mobileColumns?: 1 | 2
}>(), {
  centered: false,
  mobileColumns: 1,
})

// Fixed desktop banners already sit in a 1350px row with 18px gaps, so each
// column is exactly 666 / 438 / 324 wide and only the height needs pinning.
const heightClass = computed(() => {
  if (props.columns === 2 || props.columns === 3) return 'lg:h-[212px]'
  if (props.columns === 4) return 'lg:h-[243px]'
  return ''
})

// Kept as literal strings so Tailwind emits every class.
const desktopGridClass: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

const gridClass = computed(() => {
  const mobile = props.mobileColumns === 2 ? 'grid-cols-2' : 'grid-cols-1'
  const gap = props.mobileColumns === 2 ? 'gap-[8px] lg:gap-[18px]' : 'gap-[18px]'
  return `grid ${mobile} ${gap} ${desktopGridClass[props.columns] ?? ''}`.trim()
})

// Mobile aspect: a 2-up row uses the 181x136 (4:3) tile from the design; a
// single-column row keeps the wide banner strip.
const mobileAspectClass = computed(() =>
  props.mobileColumns === 2 ? 'aspect-[181/136]' : 'aspect-[370/136]',
)
</script>

<template>
  <div
    class="mx-auto w-full max-w-[1440px] px-4 py-5 lg:max-w-[1350px] lg:px-0 lg:py-6"
    :class="columns > 1 ? gridClass : ''"
  >
    <a
      v-for="(item, i) in items"
      :key="i"
      :href="item.href || '#'"
      class="block overflow-hidden bg-[#bddfff] rounded-2xl"
    >
      <img
        :src="item.image"
        :alt="item.alt || ''"
        class="h-full w-full object-cover"
        :class="
          columns > 1
            ? `${mobileAspectClass} lg:aspect-auto ${heightClass}`
            : centered
              ? 'aspect-[278/212]'
              : ''
        "
        :style="!centered ? {} : { margin: '0 auto', width: '278px' }"
      >
    </a>
  </div>
</template>
