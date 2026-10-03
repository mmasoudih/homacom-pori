<script setup lang="ts">
const props = withDefaults(defineProps<{
  items: Array<{ image: string, alt?: string, href?: string }>
  columns: 1 | 2 | 3 | 4
  centered?: boolean
}>(), {
  centered: false,
})

// Fixed desktop banners already sit in a 1350px row with 18px gaps, so each
// column is exactly 666 / 438 / 324 wide and only the height needs pinning.
const heightClass = computed(() => {
  if (props.columns === 2 || props.columns === 3) return 'lg:h-[212px]'
  if (props.columns === 4) return 'lg:h-[243px]'
  return ''
})
</script>

<template>
  <div
    class="mx-auto w-full max-w-[1440px] px-4 py-5 lg:max-w-[1350px] lg:px-0 lg:py-6"
    :class="
      columns > 1
        ? 'grid grid-cols-1 gap-[18px] ' +
          ({ 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' } as Record<number, string>)[columns]
        : ''
    "
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
            ? `aspect-[370/136] lg:aspect-auto ${heightClass}`
            : centered
              ? 'aspect-[278/212]'
              : ''
        "
        :style="!centered ? {} : { margin: '0 auto', width: '278px' }"
      >
    </a>
  </div>
</template>
