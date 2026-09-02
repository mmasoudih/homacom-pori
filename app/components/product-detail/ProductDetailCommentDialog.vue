<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { IconPlus, IconMinus, IconX } from '@tabler/icons-vue'
import type { ProductDetail } from '~/data/product'

const props = withDefaults(
  defineProps<{
    open: boolean
    product: ProductDetail
  }>(),
  {},
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const ratings = [
  { value: 5, label: 'عالی', emoji: '😍' },
  { value: 4, label: 'خوب', emoji: '🙂' },
  { value: 3, label: 'متوسط', emoji: '😐' },
  { value: 2, label: 'ضعیف', emoji: '🙁' },
  { value: 1, label: 'بد', emoji: '😠' },
]

const rating = ref<number>(0)
const text = ref('')
const positives = ref<string[]>([])
const negatives = ref<string[]>([])
const positiveDraft = ref('')
const negativeDraft = ref('')

watch(
  () => props.open,
  (open) => {
    if (open) {
      rating.value = 0
      text.value = ''
      positives.value = []
      negatives.value = []
      positiveDraft.value = ''
      negativeDraft.value = ''
    }
  },
)

const canSubmit = computed(() => rating.value > 0 && text.value.trim().length >= 10)

function addPoint(list: 'positive' | 'negative') {
  const value = (list === 'positive' ? positiveDraft : negativeDraft).value.trim()
  if (!value)
    return
  if (list === 'positive')
    positives.value.push(value)
  else negatives.value.push(value)
  ;(list === 'positive' ? positiveDraft : negativeDraft).value = ''
}

function submit() {
  if (!canSubmit.value) {
    toast.error('لطفا امتیاز و متن دیدگاه (حداقل ۱۰ کاراکتر) را وارد کنید.')
    return
  }
  toast.success('دیدگاه شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.')
  emit('update:open', false)
}
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent class="max-w-[520px] gap-0 rounded-2xl p-0 sm:max-w-[520px]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 pt-5">
        <UiDialogTitle class="text-[16px] font-bold text-T-900">ثبت دیدگاه</UiDialogTitle>
        <UiDialogClose
          class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
          aria-label="بستن"
        />
      </div>

      <div class="flex max-h-[70vh] flex-col gap-5 overflow-y-auto px-6 py-5">
        <!-- Product summary -->
        <div class="flex items-center gap-3 rounded-2xl bg-T-100 p-3">
          <div class="size-16 shrink-0 overflow-hidden rounded-xl bg-T-50">
            <img
              :src="product.images[0]?.src"
              :alt="product.title"
              class="size-full object-contain p-1"
            >
          </div>
          <p class="line-clamp-2 text-[12.5px] font-medium leading-[20px] text-T-900">
            {{ product.title }}
          </p>
        </div>

        <!-- Rating -->
        <div class="flex flex-col gap-3">
          <p class="text-[13.5px] text-T-900">
            امتیاز شما به این کالا <b class="text-R-300">چقدر</b> می‌دهد؟
          </p>
          <div class="flex items-center justify-center gap-3">
            <button
              v-for="option in ratings"
              :key="option.value"
              type="button"
              class="flex h-[72px] w-[68px] flex-col items-center justify-center gap-1 rounded-2xl border transition-colors"
              :class="rating === option.value
                ? 'border-R-300 bg-R-10'
                : 'border-T-300 bg-T-50 hover:border-T-500'"
              :aria-pressed="rating === option.value"
              @click="rating = option.value"
            >
              <span class="text-[24px] leading-7">{{ option.emoji }}</span>
              <span class="text-[11.5px]" :class="rating === option.value ? 'text-R-300' : 'text-T-700'">
                {{ option.label }}
              </span>
            </button>
          </div>
        </div>

        <!-- Review text -->
        <div class="flex flex-col gap-2">
          <p class="text-[13.5px] text-T-900">دیدگاه شما درباره این کالا</p>
          <textarea
            v-model="text"
            rows="4"
            placeholder="دیدگاه خود را بنویسید..."
            class="w-full resize-none rounded-xl border border-T-300 bg-T-50 p-3.5 text-[12.5px] leading-[22px] text-T-900 outline-none transition-colors placeholder:text-T-600 focus:border-R-300"
          />
        </div>

        <!-- Positive points -->
        <div class="flex flex-col gap-2.5">
          <p class="flex items-center gap-1.5 text-[13.5px] font-bold text-[#2EA36D]">
            <IconPlus class="size-4" />
            بخش مثبت
          </p>
          <div class="flex items-center gap-2 rounded-xl border border-T-300 bg-T-50 px-3">
            <input
              v-model="positiveDraft"
              type="text"
              placeholder="نقطه قوت این کالا"
              class="h-[42px] flex-1 bg-transparent text-[12.5px] text-T-900 outline-none placeholder:text-T-600"
              @keydown.enter.prevent="addPoint('positive')"
            >
            <button
              type="button"
              class="text-T-600 transition-colors hover:text-[#2EA36D]"
              aria-label="افزودن نقطه قوت"
              @click="addPoint('positive')"
            >
              <IconPlus class="size-4.5" />
            </button>
          </div>
          <div v-if="positives.length" class="flex flex-col gap-2">
            <div
              v-for="(point, i) in positives"
              :key="`pos-${i}`"
              class="flex items-center gap-2 rounded-xl border border-T-300 bg-T-100 px-3"
            >
              <button
                type="button"
                class="text-T-600 transition-colors hover:text-R-300"
                :aria-label="`حذف ${point}`"
                @click="positives.splice(i, 1)"
              >
                <IconX class="size-4" />
              </button>
              <span class="h-[42px] flex-1 leading-[42px] text-[12.5px] text-T-900">{{ point }}</span>
            </div>
          </div>
        </div>

        <!-- Negative points -->
        <div class="flex flex-col gap-2.5">
          <p class="flex items-center gap-1.5 text-[13.5px] font-bold text-R-300">
            <IconMinus class="size-4" />
            بخش منفی
          </p>
          <div class="flex items-center gap-2 rounded-xl border border-T-300 bg-T-50 px-3">
            <input
              v-model="negativeDraft"
              type="text"
              placeholder="نقطه ضعف این کالا"
              class="h-[42px] flex-1 bg-transparent text-[12.5px] text-T-900 outline-none placeholder:text-T-600"
              @keydown.enter.prevent="addPoint('negative')"
            >
            <button
              type="button"
              class="text-T-600 transition-colors hover:text-R-300"
              aria-label="افزودن نقطه ضعف"
              @click="addPoint('negative')"
            >
              <IconPlus class="size-4.5" />
            </button>
          </div>
          <div v-if="negatives.length" class="flex flex-col gap-2">
            <div
              v-for="(point, i) in negatives"
              :key="`neg-${i}`"
              class="flex items-center gap-2 rounded-xl border border-T-300 bg-T-100 px-3"
            >
              <button
                type="button"
                class="text-T-600 transition-colors hover:text-R-300"
                :aria-label="`حذف ${point}`"
                @click="negatives.splice(i, 1)"
              >
                <IconX class="size-4" />
              </button>
              <span class="h-[42px] flex-1 leading-[42px] text-[12.5px] text-T-900">{{ point }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 border-t border-T-300 px-6 py-4">
        <button
          type="button"
          class="flex h-[42px] w-[140px] items-center justify-center rounded-xl bg-T-300 text-[13.5px] font-bold text-T-900 transition-colors hover:bg-T-400"
          @click="emit('update:open', false)"
        >
          انصراف
        </button>
        <UiButton
          class="h-[42px] w-[140px] rounded-xl text-[13.5px] font-bold"
          @click="submit"
        >
          ثبت دیدگاه
        </UiButton>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
