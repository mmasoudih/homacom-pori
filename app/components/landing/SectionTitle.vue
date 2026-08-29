<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'

withDefaults(defineProps<{
  title: string
  variant?: 'centered' | 'row'
  light?: boolean
}>(), {
  variant: 'row',
  light: false,
})
</script>

<template>
  <div
    v-if="variant === 'centered'"
    class="flex items-center justify-center gap-[9px]"
  >
    <!-- Rotated (180deg) version of Figma node 764:64355 -->
    <span class="relative block h-4 w-[17px] rotate-180">
      <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
      <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
    </span>
    <h2
      class="text-xl font-bold leading-[29px]"
      :class="light ? 'text-white' : 'text-foreground'"
    >
      {{ title }}
    </h2>
    <!-- Figma node 764:64355 as designed -->
    <span class="relative block h-4 w-[17px]">
      <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
      <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
    </span>
  </div>

  <div
    v-else
    class="flex items-center justify-between"
  >
    <div class="flex items-center gap-[9px]">
      <span class="flex flex-col gap-[2px] leading-none">
        <span class="block h-[6px] w-[6px] rounded-[3px] bg-primary" />
        <span class="block h-[6px] w-[6px] rounded-[3px] bg-primary opacity-25" />
      </span>
      <h2
        class="text-xl font-bold leading-[29px]"
        :class="light ? 'text-white' : 'text-foreground'"
      >
        {{ title }}
      </h2>
      <span class="flex flex-col gap-[2px] leading-none">
        <span class="block h-[6px] w-[6px] rounded-[3px] bg-primary opacity-25" />
        <span class="block h-[6px] w-[6px] rounded-[3px] bg-primary" />
      </span>
    </div>
    <a
      href="#"
      class="flex items-center gap-1 rounded-full border border-border px-4 h-[38px] transition-colors hover:bg-secondary"
      :class="light ? 'border-white/30 text-white' : ''"
    >
      <span
        class="text-sm font-semibold"
        :class="light ? 'text-white' : 'text-primary'"
      >مشاهده همه</span>
      <IconChevronLeft
        class="size-4"
        :class="light ? 'text-white' : 'text-primary'"
      />
    </a>
  </div>
</template>
