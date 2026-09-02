<script setup lang="ts">
import { ref } from 'vue'
import { IconChevronDown } from '@tabler/icons-vue'

defineProps<{
  title: string
  text: string
}>()

const expanded = ref(false)
</script>

<template>
  <section class="flex w-full flex-col gap-3 border-t border-T-300 pt-5 lg:hidden">
    <h2 class="text-[14px] font-bold text-T-900">{{ title }}</h2>
    <p class="text-[12px] leading-[22px] text-T-800" :class="!expanded && 'line-clamp-2'">
      {{ text }}
    </p>
    <button
      type="button"
      class="flex items-center gap-1 self-start text-[12px] font-medium text-R-300"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'نمایش کمتر' : 'نمایش بیشتر' }}
      <IconChevronDown class="size-4 transition-transform" :class="expanded && 'rotate-180'" />
    </button>
  </section>
</template>
