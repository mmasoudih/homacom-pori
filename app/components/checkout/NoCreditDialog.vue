<script setup lang="ts">
import { toast } from 'vue-sonner'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :show-close-button="false"
      overlay-class="bg-[#1D1D1F]/45 backdrop-blur-[8px]"
      class="flex! max-h-[90dvh] flex-col overflow-hidden max-w-[356px] gap-0 rounded-[24px] border-0 p-0 lg:max-w-[356px]"
    >
      <div class="flex shrink-0 items-center justify-between gap-3 border-b border-T-400 px-6 py-6">
        <UiDialogTitle class="text-[16px] font-bold text-T-900">عدم اعتبار</UiDialogTitle>
        <UiDialogDescription class="sr-only">نبود اعتبار برای پرداخت اقساطی</UiDialogDescription>
        <UiDialogClose class="flex size-5 items-center justify-center" aria-label="بستن">
          <img src="/icons/cart/dialog-close.svg" alt="" class="size-5">
        </UiDialogClose>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-6 py-8">
        <UiTypography as="p" size="lg" class="leading-[24px]">
          درحال حاضر شما در دیجی‌پی وام فعال ندارید.
        </UiTypography>
      </div>

      <div class="shrink-0 p-6 pt-0">
        <button
          type="button"
          class="flex h-[42px] w-full items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-R-400"
          @click="toast.info('درخواست اعتبار شما ثبت شد و در حال بررسی است.'); emit('update:open', false)"
        >
          <UiTypography as="span" size="lg" weight="bold" color="white">درخواست اعتبار</UiTypography>
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
