<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  IconArrowRight,
  IconSortDescending,
  IconStarFilled,
  IconThumbUp,
  IconThumbDown,
  IconChevronDown,
  IconUser,
} from '@tabler/icons-vue'
import type { CommentSort, ProductDetail } from '~/data/product'

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

const sortOptions: Array<{ id: CommentSort, label: string }> = [
  { id: 'useful', label: 'مفیدترین' },
  { id: 'newest', label: 'جدیدترین' },
  { id: 'oldest', label: 'قدیمی‌ترین' },
  { id: 'lowest', label: 'کمترین امتیاز' },
  { id: 'highest', label: 'بیشترین امتیاز' },
]

const activeSort = ref<CommentSort>('useful')
const sortOpen = ref(false)
const expanded = ref<Set<string>>(new Set())

watch(
  () => props.open,
  (open) => {
    if (open) {
      activeSort.value = 'useful'
      sortOpen.value = false
      expanded.value = new Set()
    }
  },
)

const items = computed(() => {
  const list = [...props.product.comments.items]
  switch (activeSort.value) {
    case 'newest':
      return list.reverse()
    case 'oldest':
      return list
    case 'lowest':
      return list.sort((a, b) => a.rating - b.rating)
    case 'highest':
      return list.sort((a, b) => b.rating - a.rating)
    default:
      return list.sort((a, b) => b.likes - a.likes)
  }
})

function toggleExpand(id: string) {
  if (expanded.value.has(id))
    expanded.value.delete(id)
  else expanded.value.add(id)
  expanded.value = new Set(expanded.value)
}

const dialogShell
  = 'top-0! start-0! translate-x-0! translate-y-0! w-full! max-w-full! h-[100dvh]! max-h-[100dvh]! rounded-none! flex! flex-col!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      class="max-w-[402px] gap-0 rounded-2xl p-0 sm:max-w-[402px]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-T-300 px-4 py-3.5">
        <div class="flex items-center gap-2">
          <UiDialogClose
            class="flex size-9 items-center justify-center text-T-900"
            aria-label="بازگشت"
          >
            <IconArrowRight class="size-5" />
          </UiDialogClose>
          <UiDialogTitle class="text-[15px] font-bold text-T-900">دیدگاه کاربران</UiDialogTitle>
        </div>

        <!-- Sort -->
        <div class="relative">
          <button
            type="button"
            class="flex size-9 items-center justify-center text-T-900"
            aria-label="مرتب‌سازی"
            @click="sortOpen = !sortOpen"
          >
            <IconSortDescending class="size-5" />
          </button>
          <div
            v-if="sortOpen"
            class="absolute end-0 top-11 z-10 flex w-[140px] flex-col rounded-xl border border-T-300 bg-T-50 p-1.5 shadow-lg"
          >
            <button
              v-for="option in sortOptions"
              :key="option.id"
              type="button"
              class="rounded-lg px-3 py-2 text-start text-[12px] transition-colors"
              :class="activeSort === option.id ? 'bg-R-10 font-medium text-R-300' : 'text-T-700 hover:bg-T-100'"
              @click="activeSort = option.id; sortOpen = false"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Comments list -->
      <div class="flex flex-1 flex-col overflow-y-auto px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <article
          v-for="comment in items"
          :key="comment.id"
          class="flex flex-col gap-2.5 border-b border-T-300 py-4 last:border-b-0"
        >
          <!-- Header -->
          <div class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-T-200 text-T-600">
              <img
                v-if="comment.reply && comment.author === 'هماکام'"
                :src="'/homacom-logo.png'"
                :alt="comment.author"
                class="size-6 object-contain"
              >
              <IconUser v-else class="size-5" />
            </span>
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="truncate text-[12.5px] font-bold text-T-900">{{ comment.author }}</span>
                <span
                  v-if="comment.isBuyer"
                  class="flex h-[20px] shrink-0 items-center rounded-md bg-[#EEF0FF] px-1.5 text-[10px] font-bold text-[#5A6AFF]"
                >خریدار</span>
                <span
                  v-else-if="!comment.isBuyer && comment.reply"
                  class="flex h-[20px] shrink-0 items-center rounded-md bg-R-10 px-1.5 text-[10px] font-bold text-R-300"
                >تاییدشده</span>
              </div>
              <span class="text-[10.5px] text-T-600">{{ comment.date }}</span>
            </div>
          </div>

          <!-- Stars -->
          <div class="flex items-center gap-0.5">
            <IconStarFilled
              v-for="i in 5"
              :key="i"
              class="size-3.5"
              :class="i <= comment.rating ? 'text-[#FFAA39]' : 'text-T-400'"
            />
          </div>

          <!-- Body -->
          <p class="whitespace-pre-line text-[12px] leading-[22px] text-T-800">{{ comment.text }}</p>

          <!-- Expand -->
          <button
            type="button"
            class="flex items-center gap-1 self-start text-[11.5px] font-medium text-R-300"
            @click="toggleExpand(comment.id)"
          >
            <IconChevronDown class="size-3.5 transition-transform" :class="expanded.has(comment.id) && 'rotate-180'" />
            {{ expanded.has(comment.id) ? 'بستن' : 'مشاهده بیشتر' }}
          </button>

          <!-- Footer actions -->
          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-2">
              <span class="flex h-[30px] items-center gap-1.5 rounded-lg border border-T-300 px-2.5 text-[11.5px] text-T-700">
                {{ comment.likes }}
                <IconThumbUp class="size-4" />
              </span>
              <span class="flex h-[30px] items-center gap-1.5 rounded-lg border border-T-300 px-2.5 text-[11.5px] text-T-700">
                {{ comment.dislikes }}
                <IconThumbDown class="size-4" />
              </span>
            </div>
            <span class="flex h-[30px] items-center gap-1.5 text-[11.5px] text-T-700">
              پاسخ ({{ comment.reply ? 1 : 0 }})
            </span>
          </div>

          <!-- Reply -->
          <div v-if="comment.reply && expanded.has(comment.id)" class="flex flex-col gap-2 rounded-xl bg-T-100 p-3">
            <span class="flex h-[22px] w-fit items-center rounded-lg bg-R-10 px-2 text-[10.5px] font-bold text-R-300">
              پاسخ {{ comment.reply.author }}
            </span>
            <p class="text-[11.5px] leading-[20px] text-T-700">{{ comment.reply.text }}</p>
          </div>
        </article>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
