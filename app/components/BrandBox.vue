<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  name: string
  logo: string
  /** Optional link target. When omitted the box renders as a non-interactive `div`. */
  href?: string
  class?: string
}>(), {
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
      :src="logo"
      :alt="name"
      class="h-[49px] w-[65px] object-contain"
    >
    <UiTypography as="span" size="lg" weight="regular" class="text-foreground lg:text-[16px]">
      {{ name }}
    </UiTypography>
  </component>
</template>
