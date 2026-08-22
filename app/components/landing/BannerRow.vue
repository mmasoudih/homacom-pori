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
    class="mx-auto w-full max-w-[1350px]"
    :class="columns > 1 ? 'grid gap-[18px]' : ''"
    :style="columns > 1 ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {}"
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
        :class="centered ? 'aspect-[278/212] rounded-none' : ''"
        :style="!centered ? {} : { margin: '0 auto', width: '278px' }"
      >
    </a>
  </div>
</template>
