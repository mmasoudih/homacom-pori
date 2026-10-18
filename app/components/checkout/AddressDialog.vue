<script setup lang="ts">
import type { CheckoutAddress } from '~/data/checkout'

defineProps<{
  open: boolean
  selectedId: string
  addresses: CheckoutAddress[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:selectedId': [value: string]
  add: []
}>()

const dialogShell
  = 'max-lg:top-auto! max-lg:bottom-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:rounded-b-none! max-lg:rounded-t-[24px]! max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'

function select(address: CheckoutAddress) {
  emit('update:selectedId', address.id)
  emit('update:open', false)
}
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      overlay-class="bg-[#1D1D1F]/45 backdrop-blur-[8px]"
      class="flex! max-h-[90dvh] flex-col overflow-hidden max-w-[543px] gap-0 rounded-[24px] border-0 p-0 lg:max-w-[543px]"
    >
      <div class="flex shrink-0 items-center justify-between gap-3 border-b border-T-400 px-4 py-6 lg:px-6">
        <UiDialogTitle class="text-[16px] font-bold text-T-900">انتخاب آدرس</UiDialogTitle>
        <UiDialogDescription class="sr-only">انتخاب آدرس تحویل سفارش</UiDialogDescription>
        <UiDialogClose class="flex size-5 items-center justify-center" aria-label="بستن">
          <img src="/icons/cart/dialog-close.svg" alt="" class="size-5">
        </UiDialogClose>
      </div>

      <div v-if="addresses.length" class="scrollbar-thin flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4 lg:px-6">
        <button
          v-for="address in addresses"
          :key="address.id"
          type="button"
          role="radio"
          :aria-checked="address.id === selectedId"
          class="flex items-start gap-3 rounded-[12px] border p-4 text-start transition-colors"
          :class="address.id === selectedId ? 'border-R-300' : 'border-T-400 hover:border-T-500'"
          @click="select(address)"
        >
          <img
            :src="address.id === selectedId
              ? '/icons/cart/radio-selected.svg'
              : '/icons/cart/radio-unselected.svg'"
            alt=""
            class="mt-0.5 size-[18px] shrink-0"
          >

          <span class="flex min-w-0 flex-1 flex-col gap-1.5">
            <UiTypography as="span" size="lg" weight="medium">{{ address.city }}</UiTypography>
            <UiTypography as="span" size="md" color="muted" class="leading-[18px]">
              {{ address.address }}
            </UiTypography>
            <UiTypography as="span" size="md" color="muted">
              کد پستی: {{ address.postalCode }}
            </UiTypography>
            <UiTypography as="span" size="md" color="muted">
              {{ address.recipient }} — {{ address.phone }}
            </UiTypography>
          </span>
        </button>
      </div>

      <div v-else class="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto px-6 py-10 text-center">
        <img src="/icons/cart/map-pin.svg" alt="" class="size-[46px]">
        <UiTypography as="p" size="lg" weight="medium">هنوز آدرسی ثبت نکرده‌اید</UiTypography>
        <UiTypography as="p" size="md" color="muted" class="leading-[18px]">
          برای ادامه، نشانی تحویل سفارش را اضافه کنید.
        </UiTypography>
      </div>

      <div class="shrink-0 p-5 lg:p-6">
        <button
          type="button"
          class="flex h-[42px] w-full items-center justify-center gap-2 rounded-[12px] bg-R-300 transition-colors hover:bg-R-400"
          @click="emit('add')"
        >
          <img src="/icons/cart/plus-white.svg" alt="" class="size-[18px]">
          <UiTypography as="span" size="lg" weight="bold" color="white">افزودن آدرس</UiTypography>
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
