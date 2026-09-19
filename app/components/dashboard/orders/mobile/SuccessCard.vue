<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="flex w-full max-w-[420px] flex-col items-center text-center">
    <span class="flex size-20 items-center justify-center rounded-full bg-emerald-500 text-white">
      <IconCheck class="size-11" stroke-width="3" />
    </span>

    <h1 class="mt-5 text-[16px] font-bold text-T-900">{{ title }}</h1>
    <p class="mt-3 text-[12.5px] leading-[24px] text-T-600">{{ description }}</p>

    <div v-if="$slots.default" class="mt-6 w-full">
      <slot />
    </div>

    <div v-if="$slots.footer" class="mt-6 w-full">
      <slot name="footer" />
    </div>
  </div>
</template>
