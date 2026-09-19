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
  size?: 'sm' | 'md'
}>(), {
  modelValue: null,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: CommentMood]
}>()

const wrapClass = computed(() => (props.size === 'sm' ? 'gap-1.5' : 'gap-3'))
const iconClass = computed(() => (props.size === 'sm' ? 'size-7' : 'size-8'))

const moods: { key: CommentMood, icon: Component, label: string }[] = [
  { key: 'angry', icon: IconMoodAngry, label: 'خیلی بد' },
  { key: 'sad', icon: IconMoodSad, label: 'بد' },
  { key: 'neutral', icon: IconMoodNeutral, label: 'معمولی' },
  { key: 'happy', icon: IconMoodHappy, label: 'خوب' },
  { key: 'love', icon: IconMoodHeart, label: 'عالی' },
]
</script>

<template>
  <div class="flex items-center" :class="wrapClass">
    <button
      v-for="mood in moods"
      :key="mood.key"
      type="button"
      class="transition-transform hover:scale-110"
      :class="modelValue === mood.key ? 'text-primary' : 'text-T-500'"
      :aria-label="mood.label"
      :aria-pressed="modelValue === mood.key"
      @click="emit('update:modelValue', mood.key)"
    >
      <component :is="mood.icon" :class="iconClass" />
    </button>
  </div>
</template>
