<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="w-full max-w-[560px] rounded-[20px] border border-T-400 bg-T-50 p-6 text-center lg:p-8">
    <span class="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white">
      <IconCheck class="size-9" stroke-width="3" />
    </span>

    <h1 class="mt-5 text-[16px] font-bold text-T-900">{{ title }}</h1>
    <p class="mt-3 text-[12.5px] leading-[24px] text-T-600">{{ description }}</p>

    <slot />
  </div>
</template>
