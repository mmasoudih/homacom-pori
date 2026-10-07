<script setup lang="ts">
import type { TypographyVariants } from '~/components/ui/typography'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  title: string
  /** Desktop-only title override (below `lg` the `title` value is used). */
  titleDesktop?: string
  subtitle?: string
  breadcrumb?: string[]
  /** Title typography size. Defaults to responsive `xl3xl` (16px mobile → 20px desktop). */
  titleSize?: TypographyVariants['size']
  /** Subtitle typography size. Defaults to responsive `mdLg` (12.5px mobile → 14px desktop). */
  subtitleSize?: TypographyVariants['size']
  class?: string
}>(), {
  titleDesktop: undefined,
  subtitle: '',
  breadcrumb: undefined,
  titleSize: 'xl3xl',
  subtitleSize: 'mdLg',
  class: '',
})

const parts = computed(() => props.breadcrumb ?? [])
</script>

<template>
  <div :class="cn('flex flex-col items-center px-4 lg:px-6', props.class)">
    <UiBreadcrumb
      v-if="parts.length"
      :trail="parts"
      class="-mt-2 mb-6 justify-start"
    />

    <!-- Icon slot (optional) -->
    <div v-if="$slots.icon" class="mb-3 lg:mb-6">
      <slot name="icon" />
    </div>

    <UiTypography
      as="h1"
      :size="titleSize"
      weight="medium"
      color="default"
      class="text-center"
    >
      <template v-if="titleDesktop">
        <span class="lg:hidden">{{ title }}</span>
        <span class="hidden lg:inline">{{ titleDesktop }}</span>
      </template>
      <template v-else>{{ title }}</template>
    </UiTypography>

    <UiTypography
      v-if="subtitle"
      as="p"
      :size="subtitleSize"
      weight="regular"
      color="muted"
      class="mt-3 max-w-[620px] text-center leading-[26px]"
    >
      {{ subtitle }}
    </UiTypography>
  </div>
</template>
