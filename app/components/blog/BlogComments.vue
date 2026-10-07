<script setup lang="ts">
import {
  IconArrowBackUp,
  IconArrowsSort,
  IconDotsVertical,
  IconPencilPlus,
  IconStarFilled,
  IconUser,
} from '@tabler/icons-vue'
import type { BlogComment } from '~/data/blog'
import { cn } from '~/lib/utils'
import { toPersianDigits } from '~/utils/format'

const props = withDefaults(defineProps<{
  comments: BlogComment[]
  /** Total rendered next to the sort controls. */
  total?: number
  class?: string
}>(), {
  total: 180,
  class: '',
})

const sorts = [
  { id: 'newest', label: 'جدیدترین' },
  { id: 'oldest', label: 'قدیمی‌ترین' },
  { id: 'highest', label: 'بیشترین امتیاز' },
  { id: 'lowest', label: 'کمینترین امتیاز' },
] as const

const activeSort = ref<string>('newest')
const expanded = ref<string[]>([])
const page = ref(1)

function isExpanded(id: string) {
  return expanded.value.includes(id)
}

function toggleExpanded(id: string) {
  expanded.value = isExpanded(id)
    ? expanded.value.filter(item => item !== id)
    : [...expanded.value, id]
}
</script>

<template>
  <section :class="cn('flex w-full flex-col gap-4', props.class)">
    <!-- Heading + «افزودن دیدگاه» -->
    <div class="flex items-center justify-between">
      <h2 class="flex items-center gap-[9px] text-[18px] font-bold leading-[28px] text-T-900">
        <span class="relative block h-4 w-[17px]" aria-hidden="true">
          <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
          <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
        </span>
        دیدگاه کاربران
      </h2>

      <button
        type="button"
        class="flex h-11 items-center gap-2 rounded-full border border-primary px-5 text-[14px] font-medium text-primary transition-colors hover:bg-R-10"
      >
        <IconPencilPlus class="size-5" />
        افزودن دیدگاه
      </button>
    </div>

    <!-- Sort row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1">
        <IconArrowsSort class="me-2 size-[18px] text-T-700" />
        <span class="me-1 text-[13.5px] text-T-900">مرتب سازی:</span>
        <button
          v-for="sort in sorts"
          :key="sort.id"
          type="button"
          class="rounded-lg px-2.5 py-1 text-[13.5px] transition-colors"
          :class="activeSort === sort.id
            ? 'font-bold text-primary'
            : 'text-T-700 hover:text-foreground'"
          @click="activeSort = sort.id"
        >
          {{ sort.label }}
        </button>
      </div>

      <span class="text-[13.5px] text-T-700">{{ toPersianDigits(total) }} دیدگاه</span>
    </div>

    <div class="h-px w-full bg-T-400" />

    <!-- Comment list -->
    <div class="flex flex-col gap-3">
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="overflow-hidden rounded-2xl border border-T-400 bg-T-50"
      >
        <!-- Author row -->
        <header class="flex items-center justify-between border-b border-T-400 px-5 py-[13px]">
          <div class="flex items-center gap-3">
            <span class="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-T-300 text-T-600">
              <img
                v-if="comment.admin"
                src="/icons/logo.svg"
                alt=""
                class="size-7 object-contain"
              >
              <IconUser v-else class="size-6" />
            </span>
            <div class="flex flex-col items-start gap-1">
              <span class="text-[15px] font-bold text-T-900">{{ comment.author }}</span>
              <span class="text-[12px] text-T-700">{{ comment.date }}</span>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span
              v-if="comment.admin"
              class="flex h-7 items-center rounded-lg bg-R-10 px-3 text-[12.5px] font-bold text-primary"
            >
              ادمین
            </span>
            <span v-else-if="comment.rating" class="flex items-center gap-0.5">
              <IconStarFilled
                v-for="i in 5"
                :key="i"
                class="size-[19px]"
                :class="i <= comment.rating ? 'text-[#FFAA39]' : 'text-T-400'"
              />
            </span>
            <button
              type="button"
              class="flex size-6 items-center justify-center text-T-900 transition-opacity hover:opacity-60"
              aria-label="گزینه‌ها"
            >
              <IconDotsVertical class="size-5" />
            </button>
          </div>
        </header>

        <!-- Body -->
        <div class="flex flex-col gap-3 px-5 py-4">
          <p
            class="text-[15px] leading-[30px] text-T-800"
            :class="comment.clamp && !isExpanded(comment.id) ? 'line-clamp-3' : ''"
          >
            {{ comment.text }}
          </p>

          <button
            v-if="comment.clamp && !isExpanded(comment.id)"
            type="button"
            class="flex w-fit items-center gap-1 text-[13.5px] font-bold text-primary"
            @click="toggleExpanded(comment.id)"
          >
            مشاهده بیشتر
            <span aria-hidden="true">‹</span>
          </button>

          <ul v-if="comment.pros?.length || comment.cons?.length" class="flex flex-col gap-2">
            <li
              v-for="pro in comment.pros"
              :key="`pro-${pro}`"
              class="flex items-center gap-2 text-[14.5px] text-T-800"
            >
              <span class="font-bold text-primary">+</span>
              {{ pro }}
            </li>
            <li
              v-for="con in comment.cons"
              :key="`con-${con}`"
              class="flex items-center gap-2 text-[14.5px] text-T-800"
            >
              <span class="font-bold text-T-900">−</span>
              {{ con }}
            </li>
          </ul>

          <button
            v-if="!comment.admin"
            type="button"
            class="flex w-fit items-center gap-2 text-[13.5px] text-T-700 transition-colors hover:text-primary"
          >
            <IconArrowBackUp class="size-[18px]" />
            پاسخ ({{ toPersianDigits(comment.replyCount ?? 0) }})
          </button>
        </div>
      </article>
    </div>

    <AppPagination v-model:page="page" :pages="125" class="mt-4" />
  </section>
</template>
