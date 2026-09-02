<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  breadcrumb?: string[]
  class?: string
}>(), {
  subtitle: '',
  breadcrumb: undefined,
  class: '',
})

const parts = computed(() => props.breadcrumb ?? [])
</script>

<template>
  <div :class="cn('flex flex-col items-center px-4', props.class)">
    <ProductDetailBreadcrumb
      v-if="parts.length"
      :trail="parts"
      class="mb-6 justify-center"
    />

    <!-- Icon slot (optional) -->
    <div v-if="$slots.icon" class="mb-6">
      <slot name="icon" />
    </div>

    <h1 class="text-center text-[26px] font-bold leading-[38px] text-foreground lg:text-[30px] lg:leading-[44px]">
      {{ title }}
    </h1>

    <p
      v-if="subtitle"
      class="mt-3 max-w-[620px] text-center text-[15px] leading-[26px] text-T-700"
    >
      {{ subtitle }}
    </p>
  </div>
</template>