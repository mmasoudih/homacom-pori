<script setup lang="ts">
import type { ProductDetail } from '~/data/product'

defineProps<{
  open: boolean
  insurance: ProductDetail['insurance']
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent class="max-w-[560px] gap-0 rounded-2xl p-0 sm:max-w-[560px]">
      <div class="flex items-center justify-between px-6 pt-5">
        <UiDialogTitle class="text-[16px] font-bold text-T-900">
          {{ insurance.title }}
        </UiDialogTitle>
        <UiDialogClose
          class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
          aria-label="بستن"
        />
      </div>

      <div class="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-6 py-5">
        <h3 class="text-[14px] font-bold text-T-900">شرایط {{ insurance.title }}</h3>
        <p
          v-for="(paragraph, i) in insurance.paragraphs"
          :key="i"
          class="text-[12.5px] leading-[24px] text-T-800"
        >
          {{ paragraph }}
        </p>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
