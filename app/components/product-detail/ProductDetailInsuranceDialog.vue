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
  = 'max-lg:top-auto! max-lg:bottom-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:rounded-b-none! max-lg:rounded-t-2xl! max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      overlay-class="bg-[#1D1D1F]/45"
      :show-close-button="false"
      class="flex max-w-[543px] flex-col gap-0 rounded-3xl border-0 bg-white p-0 shadow-none lg:h-[592px] lg:max-h-[92vh] lg:max-w-[543px]"
    >
      <!-- Header -->
      <div class="flex h-[71px] shrink-0 items-center gap-3 px-6">
        <div class="flex min-w-0 flex-1 flex-col gap-[5px]">
          <UiDialogTitle as-child>
            <UiTypography as="h2" size="xl" weight="bold">
              {{ insurance.title }}
            </UiTypography>
          </UiDialogTitle>
        </div>

        <UiDialogClose
          class="flex size-5 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
          aria-label="بستن"
        >
          <img src="/icons/product-detail/xmark-20.svg" alt="" class="size-5">
        </UiDialogClose>
      </div>

      <div class="mx-6 h-px shrink-0 bg-T-400" />

      <!-- Body -->
      <div class="flex min-h-0 flex-1 flex-col gap-[14px] overflow-y-auto px-6 pt-[31px] pb-6 max-lg:max-h-[58vh] max-lg:px-4 max-lg:pt-5">
        <UiTypography as="h3" size="xl" weight="medium" class="shrink-0 pl-8">
          جزئیات {{ insurance.title }}
        </UiTypography>

        <div class="flex flex-col">
          <UiTypography
            v-for="(paragraph, i) in insurance.paragraphs"
            :key="i"
            as="p"
            size="lg"
            color="emphasis"
            class="leading-[33.6px]"
          >
            {{ paragraph }}
          </UiTypography>
        </div>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
