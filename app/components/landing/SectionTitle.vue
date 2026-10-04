<script setup lang="ts">
import { computed } from 'vue'
import { IconChevronLeft } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  title: string
  /** Optional trailing phrase highlighted in the brand red on mobile. */
  accent?: string
  /** Highlight the accent phrase on desktop too (defaults to mobile only). */
  accentAlways?: boolean
  variant?: 'centered' | 'row'
  light?: boolean
  indicator?: 'both' | 'right'
  indicatorColor?: 'primary' | 'white'
  /** Desktop title size: 20px (default) or 22px. */
  titleSize?: '20' | '22'
  /** Target of the «مشاهده همه» link. */
  to?: string
}>(), {
  accent: undefined,
  accentAlways: false,
  variant: 'row',
  light: false,
  indicator: 'both',
  indicatorColor: 'primary',
  titleSize: '20',
  to: '#',
})

const barClass = computed(() => (props.indicatorColor === 'white' ? 'bg-white' : 'bg-primary'))
const titleSizeVariant = computed(() => (props.titleSize === '22' ? '4xl' : '3xl'))
</script>

<template>
  <div
    v-if="variant === 'centered'"
    class="flex items-center justify-center gap-[9px]"
  >
    <!-- Rotated (180deg) version of Figma node 764:64355 -->
    <span class="relative block h-4 w-[17px] rotate-180">
      <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] opacity-25" :class="barClass" />
      <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px]" :class="barClass" />
    </span>
    <UiTypography
      as="h2"
      :size="titleSizeVariant"
      weight="bold"
      class="leading-[29px] max-lg:text-[16px]"
      :class="light ? 'text-white' : 'text-foreground'"
    >
      {{ title }}<span v-if="accent" :class="accentAlways ? 'text-R-300' : 'max-lg:text-R-300'">{{ accent }}</span>
    </UiTypography>
    <!-- Figma node 764:64355 as designed -->
    <span class="relative block h-4 w-[17px]">
      <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px]" :class="barClass" />
      <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] opacity-25" :class="barClass" />
    </span>
  </div>

  <div
    v-else
    class="flex items-center justify-between"
  >
    <div class="flex items-center gap-[9px]">
      <span class="relative block h-4 w-[17px] rotate-180">
        <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] opacity-25" :class="barClass" />
        <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px]" :class="barClass" />
      </span>
      <UiTypography
        as="h2"
        :size="titleSizeVariant"
        weight="bold"
        class="leading-[29px] max-lg:text-[16px]"
        :class="light ? 'text-white' : 'text-foreground max-lg:text-T-900'"
      >
        {{ title }}<span v-if="accent" :class="accentAlways ? 'text-R-300' : 'max-lg:text-R-300'">{{ accent }}</span>
      </UiTypography>
      <span v-if="indicator === 'both'" class="relative block h-4 w-[17px]">
        <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px]" :class="barClass" />
        <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] opacity-25" :class="barClass" />
      </span>
    </div>
    <NuxtLink
      :to="to"
      class="flex items-center gap-1 rounded-full px-4 h-[38px] transition-colors"
      :class="light ? 'text-white hover:bg-white/10' : 'hover:bg-secondary'"
    >
      <UiTypography
        as="span"
        size="md"
        weight="bold"
        class="max-lg:text-[11.25px]"
        :class="light ? 'text-white' : 'text-primary'"
      >مشاهده همه</UiTypography>
      <IconChevronLeft
        class="size-4"
        :class="light ? 'text-white' : 'text-primary'"
      />
    </NuxtLink>
  </div>
</template>
