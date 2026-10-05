<script setup lang="ts">
import { IconStarFilled } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  value: number
  max?: number
}>(), {
  max: 5,
})

const stars = computed(() => Array.from({ length: props.max }, (_, i) => i < props.value))
</script>

<template>
  <div class="flex items-center gap-1" role="img" :aria-label="`امتیاز ${value} از ${max}`">
    <template v-for="(filled, i) in stars" :key="i">
      <!-- Mobile -->
      <IconStarFilled
        class="size-[14px] lg:hidden"
        :class="filled ? 'text-[#FFAA39]' : 'text-T-500'"
      />
      <!-- Desktop -->
      <svg
        class="hidden size-[14px] lg:block"
        :class="filled ? 'text-[#FFAA39]' : 'text-T-500'"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M8.05097 1.6796C7.62672 0.799506 6.37333 0.799509 5.94909 1.6796L4.70614 4.25811C4.68476 4.30246 4.64246 4.33303 4.59364 4.3394L1.74533 4.71107C0.768837 4.83849 0.379724 6.04376 1.09737 6.71812L3.17215 8.66779C3.20839 8.70184 3.22478 8.752 3.21564 8.80088L2.69329 11.5933C2.5131 12.5566 3.52894 13.2994 4.39223 12.8356L6.93101 11.4716C6.97411 11.4484 7.02595 11.4484 7.06905 11.4716L9.60783 12.8356C10.4711 13.2994 11.487 12.5566 11.3068 11.5933L10.7844 8.80088C10.7753 8.752 10.7917 8.70184 10.8279 8.66779L12.9027 6.71812C13.6203 6.04376 13.2312 4.83849 12.2547 4.71107L9.40641 4.3394C9.3576 4.33303 9.31529 4.30246 9.29392 4.25811L8.05097 1.6796Z" fill="currentColor" />
      </svg>
    </template>
  </div>
</template>
