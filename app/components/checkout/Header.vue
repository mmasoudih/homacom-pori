<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Desktop link label (e.g. «بازگشت به سبد خرید»). */
    backLabel: string
    /** Mobile bar title (e.g. «اطلاعات آدرس»). */
    title: string
    /** When omitted the back control emits `back` instead of navigating. */
    backTo?: string
  }>(),
  { backTo: undefined },
)

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <!-- Slim checkout bar — desktop: centred logo + back link; mobile: back + title. -->
  <header class="border-b border-T-400 bg-T-50 lg:border-0">
    <!-- Mobile: arrow at the start (right), then the title (Figma Frame 3279) -->
    <div class="flex h-[62px] items-center gap-5 px-4 lg:hidden">
      <button
        v-if="!backTo"
        type="button"
        class="relative flex size-6 shrink-0 items-center justify-center after:absolute after:-inset-2 after:content-['']"
        :aria-label="backLabel"
        @click="emit('back')"
      >
        <img src="/icons/cart/arrow-back-dark.svg" alt="" class="size-6">
      </button>
      <NuxtLink
        v-else
        :to="backTo"
        class="relative flex size-6 shrink-0 items-center justify-center after:absolute after:-inset-2 after:content-['']"
        :aria-label="backLabel"
      >
        <img src="/icons/cart/arrow-back-dark.svg" alt="" class="size-6">
      </NuxtLink>

      <UiTypography as="span" size="xl" weight="bold" class="leading-[19px]">{{ title }}</UiTypography>
    </div>

    <!-- Desktop: 1350px bar, 45px gutters, 16px from the top (Figma Frame 3339) -->
    <div class="mx-auto hidden w-full max-w-[1440px] px-[45px] pt-4 lg:block">
      <div
        class="relative flex h-[64px] w-full items-center justify-between rounded-[20px] border border-T-400 px-6"
      >
        <button
          v-if="!backTo"
          type="button"
          class="flex items-center gap-2 text-R-300 transition-opacity hover:opacity-80"
          @click="emit('back')"
        >
          <img src="/icons/cart/arrow-back.svg" alt="" class="size-6">
          <UiTypography as="span" size="lg" weight="semibold" color="primary">
            {{ backLabel }}
          </UiTypography>
        </button>
        <NuxtLink
          v-else
          :to="backTo"
          class="flex items-center gap-2 text-R-300 transition-opacity hover:opacity-80"
        >
          <img src="/icons/cart/arrow-back.svg" alt="" class="size-6">
          <UiTypography as="span" size="lg" weight="semibold" color="primary">
            {{ backLabel }}
          </UiTypography>
        </NuxtLink>

        <NuxtLink to="/" class="absolute left-1/2 flex -translate-x-1/2 items-center" aria-label="هماکام">
          <img src="/icons/cart/checkout-logo.svg" alt="هماکام" class="h-[64px] w-auto object-contain">
        </NuxtLink>

        <span class="w-[190px]" aria-hidden="true" />
      </div>
    </div>
  </header>
</template>
