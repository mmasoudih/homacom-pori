<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  breadcrumb?: string[]
  /** Render the in-header breadcrumb on mobile only (`lg:hidden`). */
  hideBreadcrumbOnDesktop?: boolean
  class?: string
}>(), {
  subtitle: '',
  breadcrumb: undefined,
  hideBreadcrumbOnDesktop: false,
  class: '',
})

const parts = computed(() => props.breadcrumb ?? [])
</script>

<template>
  <div :class="cn('flex flex-col items-center px-4 lg:px-6', props.class)">
    <ProductDetailBreadcrumb
      v-if="parts.length"
      :trail="parts"
      :class="cn('-mt-2 mb-6 justify-start', hideBreadcrumbOnDesktop && 'lg:hidden')"
    />

    <!-- Icon slot (optional) -->
    <div v-if="$slots.icon" class="mb-6">
      <slot name="icon" />
    </div>

    <UiTypography
      as="h1"
      size="3xl"
      weight="medium"
      color="default"
      class="text-center"
    >
      {{ title }}
    </UiTypography>

    <UiTypography
      v-if="subtitle"
      as="p"
      size="lg"
      weight="regular"
      color="muted"
      class="mt-3 max-w-[620px] text-center leading-[26px]"
    >
      {{ subtitle }}
    </UiTypography>
  </div>
</template>