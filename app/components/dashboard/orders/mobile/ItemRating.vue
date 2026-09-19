<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconCheck,
  IconMessagePlus,
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

const moods: { key: NonNullable<OrderItem['rating']>; icon: Component; label: string }[] = [
  { key: 'angry', icon: IconMoodAngry, label: 'خیلی بد' },
  { key: 'sad', icon: IconMoodSad, label: 'بد' },
  { key: 'neutral', icon: IconMoodNeutral, label: 'معمولی' },
  { key: 'happy', icon: IconMoodHappy, label: 'خوب' },
  { key: 'love', icon: IconMoodHeart, label: 'عالی' },
]

const rating = ref(props.item.rating ?? null)

watch(
  () => props.item.rating,
  value => (rating.value = value ?? null),
)

const selectedMood = computed(() => moods.find(mood => mood.key === rating.value))

function comment() {
  toast.info('فرم ثبت دیدگاه به‌زودی در دسترس قرار می‌گیرد.')
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-[12px] text-T-600">امتیاز دهید:</span>
        <div class="flex items-center gap-1.5">
          <button
            v-for="mood in moods"
            :key="mood.key"
            type="button"
            class="transition-transform hover:scale-110"
            :class="rating === mood.key ? 'text-primary' : rating === null ? 'text-T-500' : 'text-T-300'"
            :aria-label="mood.label"
            @click="rating = mood.key"
          >
            <component :is="mood.icon" class="size-6" />
          </button>
        </div>
      </div>

      <span v-if="selectedMood" class="flex items-center gap-1 text-[12px] font-semibold text-primary">
        {{ selectedMood.label }}
        <IconCheck class="size-4" />
      </span>
    </div>

    <button
      type="button"
      class="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary text-[13px] font-bold text-primary transition-colors hover:bg-R-50"
      @click="comment"
    >
      {{ item.commented ? 'مشاهده دیدگاه' : 'افزودن دیدگاه' }}
      <IconMessagePlus class="size-4" />
    </button>
  </div>
</template>
