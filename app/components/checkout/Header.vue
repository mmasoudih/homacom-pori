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
    <!-- Mobile -->
    <div class="flex h-[62px] items-center justify-between gap-3 px-4 lg:hidden">
      <button
        v-if="!backTo"
        type="button"
        class="flex size-8 items-center justify-center text-R-300"
        :aria-label="backLabel"
        @click="emit('back')"
      >
        <img src="/icons/cart/arrow-back.svg" alt="" class="size-6">
      </button>
      <NuxtLink
        v-else
        :to="backTo"
        class="flex size-8 items-center justify-center text-R-300"
        :aria-label="backLabel"
      >
        <img src="/icons/cart/arrow-back.svg" alt="" class="size-6">
      </NuxtLink>

      <UiTypography as="span" size="lg" weight="bold">{{ title }}</UiTypography>
    </div>

    <!-- Desktop -->
    <div
      class="relative mx-auto hidden h-[64px] w-full max-w-[1440px] items-center justify-between px-6 lg:flex lg:rounded-[20px] lg:border lg:border-T-400"
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
  </header>
</template>
