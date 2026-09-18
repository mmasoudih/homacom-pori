<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconBrandTelegram,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconCopy,
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

const shares = [
  { key: 'telegram', icon: IconBrandTelegram, label: 'تلگرام' },
  { key: 'whatsapp', icon: IconBrandWhatsapp, label: 'واتساپ' },
  { key: 'twitter', icon: IconBrandTwitter, label: 'ایکس' },
  { key: 'copy', icon: IconCopy, label: 'کپی لینک' },
]

const rating = ref(props.item.rating ?? null)

watch(
  () => props.item.rating,
  value => (rating.value = value ?? null),
)

function comment() {
  toast.info('فرم ثبت دیدگاه به‌زودی در دسترس قرار می‌گیرد.')
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-T-400 px-4 py-3">
    <div class="flex items-center gap-2">
      <span class="text-[11.5px] text-T-600">امتیاز دهید:</span>
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
          <component :is="mood.icon" class="size-5" />
        </button>
      </div>
    </div>

    <div class="flex items-center gap-3 text-T-500">
      <button
        v-for="share in shares"
        :key="share.key"
        type="button"
        class="transition-colors hover:text-primary"
        :aria-label="share.label"
        @click="share.key === 'copy' ? toast.success('لینک کالا کپی شد.') : toast.info('اشتراک‌گذاری کالا')"
      >
        <component :is="share.icon" class="size-4" />
      </button>
    </div>

    <button
      type="button"
      class="inline-flex h-9 items-center gap-2 rounded-lg border border-primary bg-T-50 px-4 text-[11.5px] font-bold text-primary transition-colors hover:bg-R-50"
      @click="comment"
    >
      {{ item.commented ? 'مشاهده دیدگاه' : 'افزودن دیدگاه' }}
      <IconMessagePlus class="size-4" />
    </button>
  </div>
</template>
