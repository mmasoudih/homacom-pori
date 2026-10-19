<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  name: string
  logo: string
  /** Latin brand name shown when the API has no logo image. */
  titleEn?: string
  /** Optional link target. When omitted the box renders as a non-interactive `div`. */
  href?: string
  class?: string
}>(), {
  titleEn: undefined,
  href: undefined,
  class: '',
})
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    :class="cn(
      'flex h-[78px] w-full flex-col items-center justify-center rounded-[8px] border border-T-400 bg-T-50 px-3 py-2 transition-shadow lg:h-[96px] lg:rounded-[20px]',
      props.class,
    )"
  >
    <img
      v-if="logo"
      :src="logo"
      :alt="name"
      class="h-[49px] w-[65px] object-contain"
    >
    <span
      v-else-if="titleEn"
      dir="ltr"
      class="flex h-[49px] items-center text-[18px] font-bold tracking-wide text-T-700"
    >
      {{ titleEn }}
    </span>
    <span
      v-else
      class="flex size-[49px] items-center justify-center rounded-full bg-T-200 text-lg font-bold text-T-700"
    >
      {{ name.slice(0, 1) }}
    </span>
    <UiTypography as="span" size="lg" weight="regular" class="text-foreground lg:text-[16px]">
      {{ name }}
    </UiTypography>
  </component>
</template>
