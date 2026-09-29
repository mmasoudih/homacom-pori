<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue'

const emit = defineEmits<{
  add: []
}>()
</script>

<template>
  <div class="flex h-full flex-col bg-T-50 p-3 lg:p-5">
    <button
      type="button"
      class="mx-auto flex aspect-square w-[140px] max-w-full items-center justify-center rounded-[20px] border-2 border-dashed border-T-500 bg-T-100 text-T-500 transition-colors hover:border-primary hover:text-primary lg:w-[190px]"
      aria-label="افزودن کالا برای مقایسه"
      @click="emit('add')"
    >
      <IconPlus class="size-9" />
    </button>

    <div class="mt-6 flex flex-col gap-2">
      <span class="h-2 w-full max-w-[220px] rounded-full bg-T-300" />
      <span class="h-2 w-[70%] rounded-full bg-T-300" />
    </div>

    <button
      type="button"
      class="mt-auto flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-T-400 text-[13px] font-medium text-T-800 transition-colors hover:border-primary hover:text-primary lg:h-11"
      @click="emit('add')"
    >
      <IconPlus class="size-4" />
      افزودن کالا
    </button>
  </div>
</template>
