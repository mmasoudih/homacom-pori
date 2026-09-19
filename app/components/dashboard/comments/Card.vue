<script setup lang="ts">
import {
  IconDotsVertical,
  IconPencil,
  IconThumbDown,
  IconThumbUp,
  IconTrash,
} from '@tabler/icons-vue'
import type { MyComment } from '~/data/comments'
import { toPersianDigits } from '~/utils/format'

const props = defineProps<{
  comment: MyComment
}>()

const emit = defineEmits<{
  remove: [id: string]
  edit: [comment: MyComment]
}>()

const likes = ref(props.comment.likes)
const dislikes = ref(props.comment.dislikes)
const vote = ref<'like' | 'dislike' | null>(null)

function toggleLike() {
  if (vote.value === 'like') {
    vote.value = null
    likes.value -= 1
    return
  }
  if (vote.value === 'dislike') dislikes.value -= 1
  vote.value = 'like'
  likes.value += 1
}

function toggleDislike() {
  if (vote.value === 'dislike') {
    vote.value = null
    dislikes.value -= 1
    return
  }
  if (vote.value === 'like') likes.value -= 1
  vote.value = 'dislike'
  dislikes.value += 1
}
</script>

<template>
  <article class="rounded-2xl border border-T-400 bg-T-50 p-6">
    <!-- Header -->
    <div class="flex items-start gap-4">
      <ProductImage
        :src="comment.image"
        :alt="comment.title"
        container-class="size-16 shrink-0 rounded-xl bg-transparent"
      />

      <div class="min-w-0 flex-1">
        <h3 class="line-clamp-2 text-right text-[14px] font-bold leading-[24px] text-T-900">
          {{ comment.title }}
        </h3>

        <div class="mt-3 flex items-center justify-between gap-4">
          <DashboardCommentsStars :value="comment.rating" />
          <span class="text-[13px] text-T-700">{{ comment.date }}</span>
        </div>
      </div>

      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <button
            type="button"
            class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-T-400 text-T-800 transition-colors hover:border-T-500"
            aria-label="گزینه‌های دیدگاه"
          >
            <IconDotsVertical class="size-5" />
          </button>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent align="start" class="min-w-[160px]">
          <UiDropdownMenuItem class="gap-2" @select="emit('edit', comment)">
            <IconPencil class="size-4" />
            ویرایش دیدگاه
          </UiDropdownMenuItem>
          <UiDropdownMenuSeparator />
          <UiDropdownMenuItem class="gap-2 text-primary focus:text-primary" @select="emit('remove', comment.id)">
            <IconTrash class="size-4" />
            حذف دیدگاه
          </UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </div>

    <div class="my-5 border-t border-T-400" />

    <p class="text-right text-[13.5px] leading-[30px] text-T-800">{{ comment.text }}</p>

    <!-- Footer -->
    <div class="mt-5 flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-[13px] font-medium transition-colors"
          :class="vote === 'dislike' ? 'border-primary text-primary' : 'border-T-400 text-T-800 hover:border-T-500'"
          aria-label="نپسندیدن دیدگاه"
          @click="toggleDislike"
        >
          <IconThumbDown class="size-5" />
          {{ toPersianDigits(dislikes) }}
        </button>
        <button
          type="button"
          class="inline-flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-[13px] font-medium transition-colors"
          :class="vote === 'like' ? 'border-primary text-primary' : 'border-T-400 text-T-800 hover:border-T-500'"
          aria-label="پسندیدن دیدگاه"
          @click="toggleLike"
        >
          <IconThumbUp class="size-5" />
          {{ toPersianDigits(likes) }}
        </button>
      </div>

      <DashboardCommentsStatusChip :status="comment.status" />
    </div>
  </article>
</template>
