<script setup lang="ts">
import type { CartItem } from '~/data/cart'
import { cartInsuranceOptions } from '~/data/cart'

const props = defineProps<{
  open: boolean
  item: CartItem | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: [insuranceId: string | null]
}>()

const selectedId = ref<string | null>(null)

watch(
  () => [props.open, props.item?.id] as const,
  ([open]) => {
    if (open) selectedId.value = props.item?.insurance?.id ?? null
  },
  { immediate: true },
)

const options = computed(() =>
  props.item?.insuranceOptions?.length ? props.item.insuranceOptions : cartInsuranceOptions,
)

/** Bottom sheet on mobile, centred modal on desktop (same shell as the app's dialogs). */
const dialogShell
  = 'max-lg:top-auto! max-lg:bottom-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:rounded-b-none! max-lg:rounded-t-[24px]! max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'

function confirm() {
  emit('confirm', selectedId.value)
  emit('update:open', false)
}
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      overlay-class="bg-[#1D1D1F]/45 backdrop-blur-[8px]"
      class="max-w-[507px] gap-0 rounded-[24px] border-0 p-0 lg:max-w-[507px]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between gap-3 border-b border-T-400 px-4 py-6 lg:px-6">
        <UiDialogTitle class="text-[16px] font-bold text-T-900">انتخاب بیمه</UiDialogTitle>
        <UiDialogDescription class="sr-only">
          انتخاب پوشش بیمه برای کالای سبد خرید
        </UiDialogDescription>
        <UiDialogClose
          class="flex size-5 items-center justify-center"
          aria-label="بستن"
        >
          <img src="/icons/cart/dialog-close.svg" alt="" class="size-5">
        </UiDialogClose>
      </div>

      <!-- Body -->
      <div class="flex flex-col gap-[18px] px-4 py-3 lg:px-6 lg:py-8">
        <UiTypography as="p" size="lg" weight="medium">
          پوشش بیمه مورد نظر خود را برای این کالا انتخاب کنید:
        </UiTypography>

        <div class="flex flex-col gap-2.5" role="radiogroup" aria-label="انتخاب بیمه">
          <button
            v-for="option in options"
            :key="option.id"
            type="button"
            role="radio"
            :aria-checked="selectedId === option.id"
            class="flex min-h-[67px] w-full items-center gap-3.5 rounded-[8px] border p-[9px_12px] text-start transition-colors lg:min-h-[69px]"
            :class="selectedId === option.id ? 'border-R-300' : 'border-T-400 hover:border-T-500'"
            @click="selectedId = option.id"
          >
            <!-- Exact radio artwork from the file (4px red ring / 1.5px grey ring). -->
            <img
              :src="selectedId === option.id
                ? '/icons/cart/radio-selected.svg'
                : '/icons/cart/radio-unselected.svg'"
              alt=""
              class="size-[18px] shrink-0"
              aria-hidden="true"
            >

            <span class="flex min-w-0 flex-1 flex-col gap-2">
              <UiTypography as="span" size="mdLg" weight="medium">{{ option.name }}</UiTypography>
              <CartPrice
                size="sm"
                class="self-start"
                :price="option.price"
                :old-price="option.oldPrice"
                :discount="option.discount"
              />
            </span>

            <img src="/icons/cart/insurance-info.svg" alt="" class="size-4 shrink-0 lg:size-[18px]">
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center gap-3 p-5 lg:gap-6 lg:p-6">
        <button
          type="button"
          class="flex h-[41px] flex-1 items-center justify-center rounded-[12px] bg-T-300 transition-colors hover:bg-T-400 lg:h-[42px]"
          @click="emit('update:open', false)"
        >
          <UiTypography as="span" size="lg" weight="semibold">انصراف</UiTypography>
        </button>

        <button
          type="button"
          class="flex h-[41px] flex-1 items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-R-400 disabled:cursor-not-allowed disabled:opacity-50 lg:h-[42px]"
          :disabled="!selectedId"
          @click="confirm"
        >
          <UiTypography as="span" size="lg" weight="bold" color="white">ثبت</UiTypography>
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
