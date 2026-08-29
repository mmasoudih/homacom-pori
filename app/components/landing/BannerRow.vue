<script setup lang="ts">
withDefaults(defineProps<{
  items: Array<{ image: string, alt?: string, href?: string }>
  columns: 1 | 2 | 3 | 4
  centered?: boolean
}>(), {
  centered: false,
})
</script>

<template>
  <div
    class="mx-auto w-full max-w-[1350px] px-4 py-5 md:px-0 md:py-6"
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
      class="block overflow-hidden"
    >
      <img
        :src="item.image"
        :alt="item.alt || ''"
        class="h-full w-full object-cover"
        :class="
          columns > 1
            ? 'aspect-[370/136] lg:aspect-auto'
            : centered
              ? 'aspect-[278/212] rounded-none'
              : ''
        "
        :style="!centered ? {} : { margin: '0 auto', width: '278px' }"
      >
    </a>
  </div>
</template>
