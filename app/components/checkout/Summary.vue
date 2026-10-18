<script setup lang="ts">
import { formatPriceFa } from '~/utils/format'

withDefaults(
  defineProps<{
    rows: Array<{ key: string, label: string, value: number }>
    total: number
    ctaLabel: string
    /** Shown instead of the CTA while the step isn't ready (amber, Figma). */
    blockedLabel?: string
    title?: string
    class?: string
  }>(),
  { blockedLabel: '', title: '', class: '' },
)

const emit = defineEmits<{
  submit: []
}>()

const rowIcons: Record<string, string> = {
  items: '/icons/cart/row-items.svg',
  discount: '/icons/cart/row-discount.svg',
  insurance: '/icons/cart/row-insurance.svg',
  services: '/icons/cart/row-services.svg',
  shipping: '/icons/cart/row-shipping.svg',
}
</script>

<template>
  <aside :class="['flex flex-col gap-6 rounded-[12px] border border-T-400 bg-T-50 p-5', $props.class]">
    <div class="flex flex-col gap-1.5">
      <UiTypography v-if="title" as="p" size="lg" weight="bold">{{ title }}</UiTypography>

      <div
        v-for="row in rows"
        :key="row.key"
        class="flex h-[45px] items-center gap-1.5 border-b border-T-300 last:border-b-0"
      >
        <img :src="rowIcons[row.key]" alt="" class="size-5 shrink-0">

        <UiTypography as="span" size="md" color="muted">{{ row.label }}:</UiTypography>

        <span class="ms-auto flex items-baseline gap-1.5">
          <UiTypography as="span" size="lg" weight="medium" leading="none">
            {{ formatPriceFa(row.value) }}
          </UiTypography>
          <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
            تومان
          </UiTypography>
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex min-h-[26px] items-center justify-between gap-2">
        <UiTypography as="span" size="lg" weight="semibold">جمع کل</UiTypography>

        <span class="flex items-baseline gap-1.5">
          <UiTypography as="span" size="2xl" weight="bold" leading="none">
            {{ formatPriceFa(total) }}
          </UiTypography>
          <UiTypography as="span" size="md" weight="semibold" leading="none" color="subtle">
            تومان
          </UiTypography>
        </span>
      </div>

      <div
        v-if="blockedLabel && ctaLabel"
        class="flex min-h-[42px] w-full items-center justify-center rounded-[12px] border border-[#F2DDB4] px-3 text-center"
      >
        <UiTypography as="span" size="lg" weight="medium" class="text-[#CF982C]">
          {{ blockedLabel }}
        </UiTypography>
      </div>

      <button
        v-else-if="ctaLabel"
        type="button"
        class="flex h-[42px] w-full items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-R-400"
        @click="emit('submit')"
      >
        <UiTypography as="span" size="lg" weight="bold" color="white">{{ ctaLabel }}</UiTypography>
      </button>
    </div>
  </aside>
</template>
