<script setup lang="ts">
import type { ProductDetail } from '~/data/product'

defineProps<{
  open: boolean
  insurance: ProductDetail['insurance']
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const dialogShell
  = 'max-sm:top-auto! max-sm:bottom-0! max-sm:start-0! max-sm:translate-x-0! max-sm:translate-y-0! max-sm:w-full! max-sm:max-w-full! max-sm:rounded-b-none! max-sm:rounded-t-2xl! max-sm:pb-[env(safe-area-inset-bottom)] max-sm:data-[state=open]:slide-in-from-bottom-full! max-sm:data-[state=closed]:slide-out-to-bottom-full! max-sm:data-[state=open]:zoom-in-100! max-sm:data-[state=closed]:zoom-out-100! max-sm:data-[state=open]:fade-in-100! max-sm:data-[state=closed]:fade-out-100! max-sm:duration-300!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      class="max-w-[560px] gap-0 rounded-2xl p-0 sm:max-w-[560px]"
    >
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
