<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconMoodAngry,
  IconMoodHappy,
  IconMoodHeart,
  IconMoodNeutral,
  IconMoodSad,
} from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import type { OrderItem } from '~/data/orders'

const props = defineProps<{
  item: OrderItem
}>()

interface Mood {
  key: NonNullable<OrderItem['rating']>
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

const rating = ref(props.item.rating ?? null)

const selectedMood = computed(() => moods.find(mood => mood.key === rating.value))

watch(
  () => props.item.rating,
  value => (rating.value = value ?? null),
)

function comment() {
  toast.info('فرم ثبت دیدگاه به‌زودی در دسترس قرار می‌گیرد.')
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center gap-2">
      <span class="text-[11.5px] text-T-600">امتیاز دهید:</span>
      <div class="flex items-center gap-1.5">
        <button
          v-for="mood in moods"
          :key="mood.key"
          type="button"
          class="group relative transition-transform hover:scale-110"
          :class="rating === mood.key ? 'text-primary' : rating === null ? 'text-T-500' : 'text-T-300'"
          :aria-label="mood.label"
          @click="rating = mood.key"
        >
          <img
            v-if="mood.normal"
            :src="rating === mood.key ? mood.active : mood.normal"
            alt=""
            class="size-[20px]"
            aria-hidden="true"
          >
          <component :is="mood.icon" v-else class="size-[20px]" />

          <span
            class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-T-900 px-2 py-1 text-[10.5px] text-T-50 opacity-0 transition-opacity group-hover:opacity-100"
          >
            {{ mood.label }}
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

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-lg border border-primary bg-T-50 px-4 transition-colors hover:bg-R-50"
        @click="comment"
      >
        <img src="/icons/message-plus.svg" alt="" class="size-[17px]" aria-hidden="true">
        <UiTypography as="span" size="md" weight="medium" color="primary">
          {{ item.commented ? 'مشاهده دیدگاه' : 'افزودن دیدگاه' }}
        </UiTypography>
      </button>
    </div>
  </div>
</template>
