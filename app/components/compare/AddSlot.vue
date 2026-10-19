<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue'

const emit = defineEmits<{
  add: []
}>()
</script>

<template>
  <div class="flex h-[361px] w-full shrink-0 flex-col gap-4 bg-T-50 px-3 py-5 lg:h-[432px] lg:rounded-[20px] lg:px-5">
    <!-- Keep the same 20px top row as the product card (its remove button). -->
    <div class="h-5 shrink-0" aria-hidden="true" />

    <button
      type="button"
      class="mx-auto flex size-[99px] shrink-0 items-center justify-center transition-opacity hover:opacity-80 lg:size-[190px]"
      aria-label="افزودن کالا برای مقایسه"
      @click="emit('add')"
    >
      <!-- Exported from the FigCraft "file-add" icon in the Compare frame. -->
      <img
        src="/icons/file-add.svg"
        alt=""
        draggable="false"
        class="size-[70px] lg:size-[94px]"
      >
    </button>

    <div class="flex h-[60px] flex-col items-start gap-2 lg:h-10" aria-hidden="true">
      <span class="h-3 w-full rounded-full bg-T-300" />
      <span class="h-3 w-[80%] rounded-full bg-T-300" />
    </div>

    <div class="flex h-[42px] shrink-0 items-center" aria-hidden="true">
      <span class="h-3 w-[40%] rounded-full bg-T-300" />
    </div>

    <button
      type="button"
      class="flex h-9 w-full shrink-0 items-center justify-between rounded-lg border border-primary px-3 text-[12.5px] font-medium text-primary transition-colors hover:bg-R-10"
      @click="emit('add')"
    >
      <span>افزودن کالا</span>
      <IconPlus class="size-[13px] shrink-0" />
    </button>
  </div>
</template>
