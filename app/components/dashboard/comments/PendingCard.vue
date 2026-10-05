<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconMoodAngry,
  IconMoodHappy,
  IconMoodHeart,
  IconMoodNeutral,
  IconMoodSad,
} from '@tabler/icons-vue'
import type { PendingComment } from '~/data/comments'

const props = defineProps<{
  comment: PendingComment
}>()

const emit = defineEmits<{
  add: [comment: PendingComment]
}>()

interface Mood {
  key: NonNullable<PendingComment['mood']>
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

const mood = ref(props.comment.mood ?? null)

const selectedMood = computed(() => moods.find(item => item.key === mood.value))
</script>

<template>
  <article class="rounded-2xl border border-T-400 bg-T-50 p-6">
    <div class="flex items-start gap-4">
      <ProductImage
        :src="comment.image"
        :alt="comment.title"
        container-class="size-[74px] shrink-0 rounded-[8px] bg-transparent"
      />

      <UiTypography
        as="h3"
        size="lg"
        weight="medium"
        color="default"
        class="min-w-0 flex-1 text-right leading-[24px]"
      >
        {{ comment.title }}
      </UiTypography>
    </div>

    <div class="mt-5 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <UiTypography as="span" size="md" weight="regular" color="muted">امتیاز دهید:</UiTypography>
        <div class="flex items-center gap-1.5">
          <button
            v-for="item in moods"
            :key="item.key"
            type="button"
            class="group relative flex items-center justify-center transition-transform hover:scale-110"
            :class="mood === item.key ? 'text-primary' : mood === null ? 'text-T-500' : 'text-T-300'"
            :aria-label="item.label"
            @click="mood = item.key"
          >
            <img
              v-if="item.normal"
              :src="mood === item.key ? item.active : item.normal"
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

      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-lg border border-primary bg-T-50 px-4 transition-colors hover:bg-R-50"
        @click="emit('add', { ...comment, mood })"
      >
        <img src="/icons/message-plus.svg" alt="" class="size-[17px]" aria-hidden="true">
        <UiTypography as="span" size="md" weight="medium" color="primary">
          افزودن دیدگاه
        </UiTypography>
      </button>
    </div>
  </article>
</template>
