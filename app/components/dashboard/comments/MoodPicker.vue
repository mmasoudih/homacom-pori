<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconMoodAngry,
  IconMoodHappy,
  IconMoodHeart,
  IconMoodNeutral,
  IconMoodSad,
} from '@tabler/icons-vue'
import type { CommentMood } from '~/data/comments'

const props = withDefaults(defineProps<{
  modelValue?: CommentMood | null
}>(), {
  modelValue: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: CommentMood]
}>()

interface Mood {
  key: CommentMood
  icon: Component
  label: string
  /** Custom art (normal / active); falls back to the tabler `icon` when absent. */
  normal?: string
  active?: string
}

const moods: Mood[] = [
  { key: 'angry', icon: IconMoodAngry, label: 'خیلی بد', normal: '/icons/mood-angry.svg', active: '/icons/mood-angry-active.svg' },
  { key: 'sad', icon: IconMoodSad, label: 'بد', normal: '/icons/mood-sad.svg', active: '/icons/mood-sad-active.svg' },
  { key: 'neutral', icon: IconMoodNeutral, label: 'معمولی', normal: '/icons/mood-neutral.svg', active: '/icons/mood-neutral-active.svg' },
  { key: 'happy', icon: IconMoodHappy, label: 'خوب', normal: '/icons/mood-happy.svg', active: '/icons/mood-happy-active.svg' },
  { key: 'love', icon: IconMoodHeart, label: 'عالی', normal: '/icons/mood-love.svg', active: '/icons/mood-love-active.svg' },
]

const selectedMood = computed(() => moods.find(mood => mood.key === props.modelValue))
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center gap-1.5">
      <button
        v-for="item in moods"
        :key="item.key"
        type="button"
        class="group relative flex items-center justify-center transition-transform hover:scale-110"
        :class="modelValue === item.key ? 'text-primary' : modelValue === null ? 'text-T-500' : 'text-T-300'"
        :aria-label="item.label"
        :aria-pressed="modelValue === item.key"
        @click="emit('update:modelValue', item.key)"
      >
        <img
          v-if="item.normal"
          :src="modelValue === item.key ? item.active : item.normal"
          alt=""
          class="size-[20px]"
          aria-hidden="true"
        >
        <component :is="item.icon" v-else class="size-[20px]" />

        <span
          class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-T-900 px-2 py-1 text-[10.5px] text-T-50 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {{ item.label }}
        </span>
      </button>
    </div>

    <div v-if="selectedMood" class="flex items-center gap-1">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="size-3.5 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M11.1509 2.9831C11.4357 2.69834 11.8972 2.69834 12.182 2.9831C12.4667 3.26786 12.4667 3.72943 12.182 4.01419L5.76533 10.4309C5.48057 10.7156 5.019 10.7156 4.73424 10.4309L1.81757 7.51419C1.53281 7.22943 1.53281 6.76786 1.81757 6.4831C2.10233 6.19834 2.5639 6.19834 2.84866 6.4831L5.24978 8.88422L11.1509 2.9831Z"
          fill="#5A6AFF"
        />
      </svg>
      <UiTypography as="span" size="md" weight="medium" class="text-[#5A6AFF]">
        {{ selectedMood.label }}
      </UiTypography>
    </div>
  </div>
</template>
