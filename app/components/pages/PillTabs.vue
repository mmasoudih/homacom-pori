<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  tabs: string[]
  active?: number
  variant?: 'red' | 'purple'
  class?: string
}>(), {
  active: 0,
  variant: 'red',
  class: '',
})

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div
    :class="cn('flex flex-nowrap items-center justify-start gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:justify-center lg:overflow-visible', props.class)"
  >
    <button
      v-for="(tab, i) in tabs"
      :key="tab"
      type="button"
      class="shrink-0 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors"
      :class="
        i === active
          ? variant === 'red'
            ? 'border border-primary bg-R-10 text-primary'
            : 'border border-[#7C5CFF] bg-[#EFE9FB] text-[#6C4BD8]'
          : variant === 'red'
            ? 'border border-T-400 bg-T-50 text-T-700 hover:border-T-500'
            : 'border border-T-400 bg-T-50 text-[#6C4BD8] hover:border-[#C9B8FF]'
      "
      @click="emit('select', i)"
    >
      {{ tab }}
    </button>
  </div>
</template>
