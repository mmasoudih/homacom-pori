<script setup lang="ts">
import { computed } from 'vue'
import { IconChevronLeft } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  title: string
  variant?: 'centered' | 'row'
  light?: boolean
  indicator?: 'both' | 'right'
  indicatorColor?: 'primary' | 'white'
}>(), {
  variant: 'row',
  light: false,
  indicator: 'both',
  indicatorColor: 'primary',
})

const barClass = computed(() => (props.indicatorColor === 'white' ? 'bg-white' : 'bg-primary'))
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
    <h2
      class="text-xl font-bold leading-[29px]"
      :class="light ? 'text-white' : 'text-foreground'"
    >
      {{ title }}
    </h2>
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
      <h2
        class="text-xl font-bold leading-[29px]"
        :class="light ? 'text-white' : 'text-foreground'"
      >
        {{ title }}
      </h2>
      <span v-if="indicator === 'both'" class="relative block h-4 w-[17px]">
        <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px]" :class="barClass" />
        <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] opacity-25" :class="barClass" />
      </span>
    </div>
    <a
      href="#"
      class="flex items-center gap-1 rounded-full px-4 h-[38px] transition-colors"
      :class="light ? 'text-white hover:bg-white/10' : 'hover:bg-secondary'"
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
