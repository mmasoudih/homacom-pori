<script setup lang="ts">
import type { CreditProvider } from '~/data/checkout'

defineProps<{
  providers: CreditProvider[]
  selectedId: string
}>()

const emit = defineEmits<{
  toggle: [id: string]
}>()

const logos: Record<string, string> = {
  balon: '/icons/cart/credit-balon.svg',
  ewano: '/icons/cart/credit-ewano.svg',
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="provider in providers"
      :key="provider.id"
      class="rounded-[12px] border p-4 transition-colors lg:p-[16px_20px]"
      :class="provider.id === selectedId ? 'border-R-300' : 'border-T-300'"
    >
      <button
        type="button"
        role="radio"
        :aria-checked="provider.id === selectedId"
        class="flex w-full items-center gap-3 text-start"
        @click="emit('toggle', provider.id)"
      >
        <img
          :src="provider.id === selectedId
            ? '/icons/cart/radio-selected.svg'
            : '/icons/cart/radio-unselected.svg'"
          alt=""
          class="size-[18px] shrink-0"
        >

        <span class="flex min-w-0 flex-1 flex-col gap-1.5">
          <UiTypography as="span" size="xl" weight="medium">{{ provider.label }}</UiTypography>
          <UiTypography as="span" size="md" color="muted">{{ provider.description }}</UiTypography>
        </span>

        <img :src="logos[provider.id]" alt="" class="size-[52px] shrink-0 lg:size-[84px]">
      </button>
    </div>
  </div>
</template>
