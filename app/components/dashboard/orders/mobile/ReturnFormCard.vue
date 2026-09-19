<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconCheck,
  IconChevronDown,
  IconMoodAngry,
  IconMoodHappy,
  IconMoodHeart,
  IconMoodNeutral,
  IconMoodSad,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-vue'
import type { OrderItem } from '~/data/orders'
import { returnReasons } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  item: OrderItem
  quantity: number
  reason: string
  description: string
  images: string[]
}>()

const emit = defineEmits<{
  'update:quantity': [value: number]
  'update:reason': [value: string]
  'update:description': [value: string]
  increment: []
  decrement: []
  remove: []
  upload: [event: Event]
  removeImage: [index: number]
}>()

const moods: { key: NonNullable<OrderItem['rating']>; icon: Component; label: string }[] = [
  { key: 'angry', icon: IconMoodAngry, label: 'خیلی بد' },
  { key: 'sad', icon: IconMoodSad, label: 'بد' },
  { key: 'neutral', icon: IconMoodNeutral, label: 'معمولی' },
  { key: 'happy', icon: IconMoodHappy, label: 'خوب' },
  { key: 'love', icon: IconMoodHeart, label: 'عالی' },
]

const rating = ref(props.item.rating ?? null)
const selectedMood = computed(() => moods.find(mood => mood.key === rating.value))

function onReasonChange(event: Event) {
  emit('update:reason', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <section class="mb-4 rounded-2xl border border-T-300 bg-T-50 p-4">
    <!-- Product -->
    <div class="flex items-start gap-3">
      <ProductImage
        :src="item.image"
        :alt="item.title"
        container-class="size-14 shrink-0 rounded-xl bg-transparent"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-1.5 text-[11.5px] text-T-600">
        <p class="text-[12.5px] leading-[22px] text-T-800">{{ item.title }}</p>
        <span class="flex items-center gap-1.5">
          رنگ: <b class="font-semibold text-T-800">{{ item.color }}</b>
          <span class="size-3 rounded-full border border-T-300" :style="{ backgroundColor: item.colorHex }" />
        </span>
        <span>گارانتی: <b class="font-semibold text-T-800">{{ item.warranty }}</b></span>
        <span>محصول ({{ toPersianDigits(item.productCode) }})</span>
        <span>تعداد: <b class="font-semibold text-T-800">{{ toPersianDigits(item.quantity) }}</b></span>
        <span>مبلغ: <b class="font-semibold text-T-800">{{ formatPriceFa(item.price) }}</b> تومان</span>
      </div>
    </div>

    <!-- Rating -->
    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-[11.5px] text-T-600">امتیاز دهید:</span>
        <div class="flex items-center gap-1.5">
          <button
            v-for="mood in moods"
            :key="mood.key"
            type="button"
            class="transition-transform hover:scale-110"
            :class="rating === mood.key ? 'text-primary' : 'text-T-400'"
            :aria-label="mood.label"
            @click="rating = mood.key"
          >
            <component :is="mood.icon" class="size-5" />
          </button>
        </div>
      </div>

      <span v-if="selectedMood" class="flex items-center gap-1 text-[11.5px] font-semibold text-primary">
        {{ selectedMood.label }}
        <IconCheck class="size-4" />
      </span>
    </div>

    <!-- Return quantity -->
    <div class="mt-4">
      <span class="text-[12px] font-medium text-T-700">تعداد مرجوعی</span>
      <div class="mt-2 flex h-11 items-center justify-between rounded-xl border border-T-300 px-3">
        <button type="button" aria-label="افزودن" class="text-T-800" @click="emit('increment')">
          <IconPlus class="size-4" />
        </button>
        <span class="min-w-4 text-center text-[13px] font-bold text-T-900">
          {{ toPersianDigits(quantity) }}
        </span>
        <button type="button" aria-label="حذف" class="text-primary" @click="emit('remove')">
          <IconTrash class="size-4" />
        </button>
      </div>
    </div>

    <!-- Reason -->
    <div class="mt-4">
      <span class="text-[12px] font-medium text-T-700">علت مرجوعی</span>
      <div class="relative mt-2">
        <select
          :value="reason"
          class="h-11 w-full appearance-none rounded-xl border border-T-300 bg-T-50 px-3 pe-9 text-[12.5px] text-T-800 outline-none transition-colors focus:border-primary"
          @change="onReasonChange"
        >
          <option v-for="option in returnReasons" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
      </div>
    </div>

    <!-- Description -->
    <div class="mt-4">
      <span class="text-[12px] font-medium text-T-700">شرح</span>
      <Textarea
        :model-value="description"
        class="mt-2 min-h-[70px] rounded-xl border-T-300 text-[13px]"
        placeholder="علت مرجوعی را شرح دهید"
        @update:model-value="emit('update:description', String($event))"
      />
    </div>

    <!-- Upload -->
    <div class="mt-4">
      <span class="text-[12px] font-medium text-T-700">اپلود تصویر</span>
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <label
          class="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-indigo-300 p-6 text-center text-indigo-500"
        >
          <IconPlus class="size-5" />
          <span class="text-[11px] font-semibold">افزودن</span>
          <input type="file" accept="image/*" class="hidden" @change="emit('upload', $event)">
        </label>

        <div v-for="(image, index) in images" :key="index" class="relative">
          <img
            :src="image"
            alt="preview"
            class="size-14 rounded-xl border border-T-300 object-cover"
          >
          <button
            type="button"
            class="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-white"
            aria-label="حذف تصویر"
            @click="emit('removeImage', index)"
          >
            <IconX class="size-3" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
