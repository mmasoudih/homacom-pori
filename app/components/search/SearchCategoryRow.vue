<script setup lang="ts">
import type { SearchCategoryTile } from '~/data/search'

defineProps<{
  categories: SearchCategoryTile[]
}>()

const emit = defineEmits<{
  select: [tile: SearchCategoryTile]
}>()
</script>

<template>
  <ul class="-mx-1 flex gap-4 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <li v-for="tile in categories" :key="tile.id" class="shrink-0">
      <button
        type="button"
        class="group flex w-[84px] flex-col items-center gap-2"
        @click="emit('select', tile)"
      >
        <span
          class="flex size-[76px] items-center justify-center overflow-hidden rounded-[16px] border border-T-400 bg-T-50 p-2 transition-colors group-hover:border-T-500"
        >
          <img
            :src="tile.image"
            :alt="tile.title"
            loading="lazy"
            class="size-full object-contain"
          >
        </span>
        <span class="line-clamp-2 text-center text-[12.5px] font-medium leading-[17px] text-T-800">
          {{ tile.title }}
        </span>
      </button>
    </li>
  </ul>
</template>
