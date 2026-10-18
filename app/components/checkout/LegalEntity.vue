<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modelValue: boolean
  notice: string
  description: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

/**
 * Mobile disclosure: Figma's mobile box is the 54px title row by default
 * (88985) and expands to the notice + description (89063, 145px).
 */
const open = ref(false)
</script>

<template>
  <!-- Legal-entity (حقوقی) invoice switch with its completion notice. -->
  <div
    class="flex flex-col gap-[14px] rounded-[12px] border border-T-400 p-[11px] lg:flex-row lg:items-center lg:gap-3 lg:p-5"
  >
    <div class="flex min-w-0 items-center gap-[14px] max-lg:h-[30px] lg:flex-1 lg:gap-3">
      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <div class="flex flex-wrap items-center gap-2.5">
          <UiTypography as="span" size="lg" weight="medium">ثبت سفارش به صورت حقوقی</UiTypography>

          <!-- Desktop: notice chip stays inline with the title -->
          <span
            v-if="notice"
            class="hidden h-[26px] items-center gap-1.5 rounded-full border border-[#F2DDB4] bg-[#FFF6E9] px-3 lg:flex"
          >
            <span class="flex size-4 items-center justify-center rounded-full border border-[#CF982C] text-[10px] font-bold text-[#CF982C]">!</span>
            <span class="text-[12.5px] font-medium text-[#CF982C]">{{ notice }}</span>
          </span>
        </div>

        <UiTypography as="p" size="md" color="muted" class="hidden leading-[18px] lg:block">
          {{ description }}
        </UiTypography>
      </div>

      <button
        type="button"
        role="switch"
        :aria-checked="modelValue"
        class="relative h-[17px] w-[30px] shrink-0 rounded-full transition-colors max-lg:order-first"
        :class="modelValue ? 'bg-R-300' : 'bg-T-500'"
        aria-label="ثبت سفارش به صورت حقوقی"
        @click="emit('update:modelValue', !modelValue)"
      >
        <span
          class="absolute top-[2px] size-[13px] rounded-full bg-white transition-all"
          :class="modelValue ? 'start-[15px]' : 'start-[2px]'"
        />
      </button>

      <!-- Mobile: disclosure chevron at the end (left) -->
      <button
        v-if="notice || description"
        type="button"
        class="flex size-[18px] shrink-0 items-center justify-center transition-transform lg:hidden"
        :class="open ? '-rotate-90' : 'rotate-90'"
        :aria-expanded="open"
        aria-label="جزئیات سفارش حقوقی"
        @click="open = !open"
      >
        <img src="/icons/cart/angle-down.svg" alt="" class="size-[18px]">
      </button>
    </div>

    <!-- Mobile: notice chip + description under the title row -->
    <div v-if="open" class="flex flex-col gap-3 max-lg:min-h-[77px] lg:hidden">
      <span
        v-if="notice"
        class="flex h-[29px] max-w-full items-center gap-1.5 self-start rounded-full border border-[#F2DDB4] bg-[#FFF6E9] px-3"
      >
        <span class="flex size-4 shrink-0 items-center justify-center rounded-full border border-[#CF982C] text-[10px] font-bold text-[#CF982C]">!</span>
        <span class="truncate text-[12.5px] font-medium text-[#CF982C]">{{ notice }}</span>
      </span>

      <UiTypography as="p" size="md" color="muted" class="leading-[15px]">
        {{ description }}
      </UiTypography>
    </div>
  </div>
</template>
