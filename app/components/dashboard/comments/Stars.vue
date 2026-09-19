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
    <IconStarFilled
      v-for="(filled, i) in stars"
      :key="i"
      class="size-[17px]"
      :class="filled ? 'text-[#FFAA39]' : 'text-T-500'"
    />
  </div>
</template>
